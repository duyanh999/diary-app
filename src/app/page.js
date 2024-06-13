/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";

import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import Confetti from "react-confetti";
import { useSwitch } from "./context/SwitchContext";
import dayjs from "dayjs";

import { FaPlay, FaStop } from "react-icons/fa";
import { useAuthContext } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { firebase_app, storage } from "./firebase/config";
import { useGetDocuments } from "./firebase/firestore/getData";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

import { doc, updateDoc, arrayUnion, getFirestore } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import ImageItem from "./Component/imageItem";
import PureModal from "react-pure-modal";
import "react-pure-modal/dist/react-pure-modal.min.css";
import { FaGrip } from "react-icons/fa6";

export default function Home() {
  const { checked } = useSwitch();
  const { user } = useAuthContext();
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const time = dayjs().format("DD/MM/YYYY");
  const [runScreen, setRunScreen] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isFireworkActive, setIsFireworkActive] = useState(false);
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState("");
  const [modal, setModal] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [gridView, setGridView] = useState(false);
  const [indexImage, setIndexImage] = useState();

  const { getDoc, data, loading } = useGetDocuments("album");
  const fileInputRef = useRef(null);

  const dataUrls = data?.map((item) => item?.urls);

  useEffect(() => {
    if (user == null) router.push("/admin");
  }, [router, user]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (runScreen) {
      const intervalId = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 424);
        if (counter >= dataUrls[0]?.length * 424) {
          setRunScreen(false);
          setTimeout(() => {
            setCounter(0);
          }, 3000);
        }
      }, 1000); // Thay đổi khoảng thời gian tăng giá trị ở đây, đơn vị là milliseconds (1000ms = 1 giây)

      // Clear interval khi component unmount
      return () => clearInterval(intervalId);
    }
  }, [counter, dataUrls, runScreen]); // Tham số thứ hai của

  useEffect(() => {
    scrollRef.current.scrollTo({
      top: counter,
      behavior: "smooth",
    });
  }, [counter]);

  useEffect(() => {
    if (!gridView) {
      let startY = 0;

      const handleTouchStart = (event) => {
        startY = event.touches[0].clientY;
      };

      const handleTouchMove = (event) => {
        event.preventDefault(); // Ngăn chặn cuộn mặc định

        const deltaY = event.touches[0].clientY - startY;
        const itemHeight = scrollRef.current.scrollHeight / dataUrls[0]?.length;

        if (deltaY > 0) {
          // Lăn lên
          const newIndex =
            Math.floor(scrollRef.current.scrollTop / itemHeight) - 0.01;
          const scrollTo = newIndex * itemHeight;
          scrollRef.current.scrollTo({ top: scrollTo, behavior: "smooth" });
        } else if (deltaY < 0) {
          // Lăn xuống
          const newIndex =
            Math.ceil(scrollRef.current.scrollTop / itemHeight) + 0.01;
          const scrollTo = newIndex * itemHeight;
          scrollRef.current.scrollTo({ top: scrollTo, behavior: "smooth" });
        }
      };

      if (scrollRef.current) {
        scrollRef.current.addEventListener("touchstart", handleTouchStart);
        scrollRef.current.addEventListener("touchmove", handleTouchMove);
      }

      return () => {
        if (scrollRef.current) {
          scrollRef?.current.removeEventListener(
            "touchstart",
            handleTouchStart
          );
          scrollRef?.current.removeEventListener("touchmove", handleTouchMove);
        }
      };
    }
  }, [dataUrls, gridView]);
  useEffect(() => {
    if (isFireworkActive) {
      const stopFireworks = setTimeout(() => {
        setIsFireworkActive(false);
      }, 10000);

      // Clear the timeout to stop the fireworks if component unmounts or isFireworkActive changes
      return () => clearTimeout(stopFireworks);
    }
  }, [isFireworkActive]);

  useEffect(() => {
    scrollRef.current.scrollTo({
      top: (dataUrls[0]?.length + 1) * 424,
      behavior: "smooth",
    });
  }, [dataUrls[0]]);

  const handleFireworkActivation = () => {
    setIsFireworkActive(true);
  };

  useEffect(() => {
    if (runScreen) {
      setCounter(0);
    }
  }, [runScreen]);

  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      // Add minimal-ui to the viewport content
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui"
      );
    }
  }, [router.events]);

  useEffect(() => {
    if (gridView && indexImage !== undefined) {
      setGridView(false);
    }
  }, [gridView, indexImage]);

  useEffect(() => {
    if (!gridView && indexImage !== undefined) {
      scrollRef.current.scrollTo({
        top: indexImage * 424,
        behavior: "smooth",
      });
      setIndexImage(undefined);
    }
  }, [gridView, indexImage]);

  const handleUpdateIndexImage = (index) => {
    setIndexImage(index);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setModal(true); // Open modal when a file is selected
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };
  const generateUniqueFileName = (originalName) => {
    const timestamp = Date.now();
    const extension = originalName.split(".").pop();
    const uniqueName = `image_${timestamp}.${extension}`;
    return uniqueName;
  };
  const handleForm = async () => {
    if (image && textValue.trim() !== "") {
      const uniqueFileName = generateUniqueFileName(image?.name);
      const storageRef = ref(storage, `images/${uniqueFileName}`);
      clearFileInput();
      try {
        await uploadString(storageRef, base64, "data_url");
        const url = await getDownloadURL(storageRef);
        const uniqueId = uuidv4();

        const ref = doc(db, "album", "kVP5JboDGkTnorvOi3Yi");
        await updateDoc(ref, {
          urls: arrayUnion({ id: uniqueId, url, textValue, time }),
        });
        fetchData();
        setTextValue("");

        if (error) {
          console.error("Error writing document: ", error);
        } else {
          console.log(result);
        }
      } catch (error) {
        console.error("Upload failed", error);
      }
    }
  };

  const fetchData = async () => {
    getDoc();
  };
  const clearFileInput = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
    setImage(null);
  };
  const renderItemImage = (item, index) => {
    return (
      <ImageItem
        index={index}
        id={item.id}
        title={item?.textValue}
        images={item.url}
        time={item?.time}
        gridView={gridView}
        handleUpdateIndexImage={handleUpdateIndexImage}
        activeFirework={handleFireworkActivation}
      />
    );
  };

  const suggestUserChoiceList = () => {
    return (
      <div className="">
        <div className="grid place-content-center gap-4">
          <div className=" text-xs text-white flex justify-center"></div>
          <div
            ref={scrollRef}
            className="h-[420px] w-[400px] overflow-x-hidden overflow-y-auto gap-3"
          >
            {isFireworkActive && (
              <Confetti
                width={400}
                height={900}
                className="z-100"
                run={isFireworkActive}
                numberOfPieces={100}
                drawShape={(ctx) => {
                  ctx.beginPath();
                  for (let i = 0; i < Math.PI * 2; i += 0.01) {
                    const x = 16 * Math.pow(Math.sin(i), 3);
                    const y = -(
                      13 * Math.cos(i) -
                      5 * Math.cos(2 * i) -
                      2 * Math.cos(3 * i) -
                      Math.cos(4 * i)
                    );
                    ctx.lineTo(x, y);
                  }
                  ctx.fill(); // Fill hình trái tim
                  ctx.closePath();
                }}
              />
            )}
            <div className={`${gridView && "grid grid-cols-3"}`}>
              {data?.flatMap((group) =>
                group?.urls?.map((item, index) => renderItemImage(item, index))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between bg-no-repeat	h-full p-5 relative overflow-hidden`}
      style={
        checked
          ? { backgroundImage: `url(sunlight.jpg)`, backgroundSize: "cover" }
          : {
              backgroundImage: `url(nightmountain.gif)`,
              backgroundSize: "cover",
            }
      }
    >
      <div
        className={`relative flex-1 overflow-hidden ${
          gridView && "mt-[20%]"
        } mt-7`}
      >
        {suggestUserChoiceList()}
        {!gridView && (
          <div className="flex justify-center mt-4">
            <div
              className={`flex justify-around items-center shadow-2xl overflow-hidden ${
                checked ? "bg-[#f68738]" : "bg-[#334155]"
              }  p-3 rounded-full w-[300px]`}
            >
              {/* <AwesomeButton
              disabled={runScreen}
              onPress={() => {
                isToggled
                  ? scrollRef.current.scrollTo({
                      top: (dataUrls[0]?.length + 1) * 424,
                      behavior: "smooth",
                    })
                  : scrollRef.current.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                setIsToggled(!isToggled);
              }}
              className="w-[45px] items-center flex"
              type={`${checked ? "danger" : "link"}`}
            >
              {isToggled ? (
                <FaCaretDown className="text-4xl" />
              ) : (
                <FaCaretUp className="text-4xl" />
              )}
            </AwesomeButton> */}

              <AwesomeButton
                type={`${checked ? "danger" : "link"}`}
                className="w-[45px]"
                onPress={() => {
                  gridView &&
                    scrollRef.current.scrollTo({
                      top: dataUrls[0]?.length * 424,
                      behavior: "smooth",
                    });
                  setGridView(!gridView);
                }}
              >
                <FaGrip className="text-3xl" />
              </AwesomeButton>

              <div className="bg-[#2D2D2D] border-4 flex items-center justify-center border-yellow-200 px-2 rounded-full h-[70px] w-[70px]">
                <AwesomeButton
                  disabled={runScreen}
                  className="w-[40px]"
                  type={`${checked ? "danger" : "link"}`}
                  onPress={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <div className="flex items-center z-99">
                    <input
                      type="file"
                      ref={fileInputRef}
                      id="fileInput"
                      className="w-0"
                      onChange={handleImageChange}
                    />
                  </div>
                </AwesomeButton>
              </div>
              <AwesomeButton
                className="items-center flex w-[45px]"
                type={`${checked ? "danger" : "link"}`}
                onPress={() => {
                  setRunScreen((prevRunScreen) => !prevRunScreen);
                }}
              >
                <div className="bg-left-bottom text-xl font-bold bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  {runScreen ? <FaStop /> : <FaPlay />}
                </div>
              </AwesomeButton>
            </div>
          </div>
        )}
      </div>

      {/* <Link className="w-[full] bottom-20 absolute" href="/gacha">
        <span className="bg-left-bottom text-white text-base font-semibold bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
          Hôm nay em ăn gì?
        </span>
      </Link> */}
      <PureModal
        isOpen={modal}
        closeButtonPosition="bottom"
        onClose={() => {
          setModal(false);
        }}
      >
        <div className="flex justify-center overflow-hidden">
          {" "}
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Ghi chú"
            className="mt-2 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={() => {
              handleForm();
              setModal(false);
            }}
            disabled={loading || !image || textValue.trim() === ""}
          >
            UP
          </button>
        </div>
      </PureModal>
    </main>
  );
}
