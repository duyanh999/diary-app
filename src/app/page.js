/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useRef, useState } from "react";

import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import Confetti from "react-confetti";
import { useSwitch } from "./context/SwitchContext";
import { isYesterday } from "date-fns/isYesterday";
import dayjs from "dayjs";

import { FaArrowDown, FaArrowUp, FaPlay, FaStop } from "react-icons/fa";
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

export default function Home() {
  const { checked } = useSwitch();
  const { user } = useAuthContext();
  const router = useRouter();
  const db = getFirestore(firebase_app);
  const time = dayjs().format("DD/MM/YYYY");
  // const [scrollHeight, setScrollHeight] = useState(0);
  const [runScreen, setRunScreen] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isFireworkActive, setIsFireworkActive] = useState(false);
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState("");
  const [modal, setModal] = useState(false);
  const [textValue, setTextValue] = useState("");

  const { getDoc, data, loading } = useGetDocuments("album");

  const dataUrls = data?.map((item) => item?.urls);

  useEffect(() => {
    if (user == null) router.push("/admin");
  }, [router, user]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (runScreen) {
      const intervalId = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 424);
      }, 1000); // Thay đổi khoảng thời gian tăng giá trị ở đây, đơn vị là milliseconds (1000ms = 1 giây)

      // Clear interval khi component unmount
      return () => clearInterval(intervalId);
    }
  }, [runScreen]); // Tham số thứ hai của

  useEffect(() => {
    scrollRef.current.scrollTo({
      top: counter,
      behavior: "smooth",
    });
  }, [counter]);

  useEffect(() => {
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
        scrollRef?.current.removeEventListener("touchstart", handleTouchStart);
        scrollRef?.current.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [dataUrls]);
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
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      // Add minimal-ui to the viewport content
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui"
      );
    }
  }, [router.events]);

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     router.push("/login"); // Điều hướng về trang login sau khi đăng xuất
  //   } catch (error) {
  //     console.error("Error logging out: ", error);
  //   }
  // };

  // const renderPet = useCallback((item) => {
  //   switch (item) {
  //     case "catpixel":
  //       return (
  //         <img
  //           src={"./catpixel.gif"}
  //           alt="dsad"
  //           className="absolute top-[20%]"
  //         />
  //       );
  //     case "bunnypixel":
  //       return (
  //         <img
  //           src={"./bunnypixel.gif"}
  //           alt="dsad"
  //           className="absolute top-[10%]"
  //         />
  //       );
  //     case "humanpixel":
  //       return <img src={"./humanpixel.gif"} className="absolute top-[35%]" />;
  //     case "robopixel":
  //       return <img src={"./robopixel.gif"} className="absolute top-[35%]" />;
  //     default:
  //     // code block
  //   }
  // }, []);
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

        // Store the image URL in Firestore
        // const { result, error } = await addData(
        //   "album",
        //   "kVP5JboDGkTnorvOi3Yi",
        //   { url }
        // );

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
    // console.log("bs64", uploadTask);

    // const { result, error } = await addData(
    //   "album",
    //   "kVP5JboDGkTnorvOi3Yi",
    //   data
    // );

    // if (error) {
    //   return console.log(error);
    // }
    // if (result) {
    //   return console.log(result);
    // }
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
            {data?.flatMap((group) =>
              group?.urls?.map((item, index) => renderItemImage(item, index))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between bg-no-repeat	h-full p-5 relative overflow-hidden"
      style={
        checked
          ? { backgroundImage: `url(sunlight.jpg)`, backgroundSize: "cover" }
          : {
              backgroundImage: `url(nightmountain.gif)`,
              backgroundSize: "cover",
            }
      }
    >
      {/* <div className="text-white text-3xl mb-5">Yêu Hương</div> */}
      {/* <div className="relative">
        <select
          id="groupSelect"
          value={selectedGroup}
          onChange={handleGroupChange}
          className="block appearance-none mt-8 w-[150px] rounded-full text-slate-300 bg-[#2D2D2D] px-4 py-2 pr-8 shadow leading-tight focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 relative"
        >
          <option value=""> Thời điểm </option>
          {Object.keys(groupedData).map((groupKey) => (
            <option key={groupKey} value={groupKey} className="relative">
              {groupKey}
            </option>
          ))}
        </select>
        <img
          src={"./arrowselect.png"}
          alt="dsad"
          className="w-3 absolute top-[70%] left-[80%]"
        />
      </div> */}
      {/* <button onClick={handleLogout}>Logout</button> */}
      {/* <button onClick={fetchData}>data</button> */}

      {/* {!selectedGroup && renderPet(isPet)} */}
      {/* {isFireworkActive && (
        <div className="firework container z-[50] absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2" />
      )} */}
      <div className="relative flex-1 overflow-hidden mt-5">
        {suggestUserChoiceList()}
        <div className="flex mt-1 justify-center overflow-hidden">
          <AwesomeButton className="" type={`${checked ? "danger" : "link"}`}>
            <input type="file" id="fileInput" onChange={handleImageChange} />
          </AwesomeButton>
        </div>
        <div className="flex justify-center mt-2">
          <div className="flex justify-center bg-gray-600 p-3 w-[295px] rounded-md shadow-2xl">
            <div className="flex justify-around overflow-hidden bg-gray-900 p-3 rounded-md w-[200px]">
              <AwesomeButton
                onPress={() => {
                  scrollRef.current.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="w-[40px] items-center flex"
                type={`${checked ? "danger" : "link"}`}
              >
                <FaArrowUp />
              </AwesomeButton>
              <AwesomeButton
                className=" items-center flex w-[40px]"
                type={`${checked ? "danger" : "link"}`}
                onPress={() => {
                  setRunScreen((prevRunScreen) => !prevRunScreen);
                }}
              >
                <span className="bg-left-bottom text-base font-bold bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                  {runScreen ? <FaStop /> : <FaPlay />}
                </span>
              </AwesomeButton>
              <AwesomeButton
                className="w-[40px]"
                type={`${checked ? "danger" : "link"}`}
                onPress={() => {
                  scrollRef.current.scrollTo({
                    top: (dataUrls[0]?.length + 1) * 424,
                    behavior: "smooth",
                  });
                }}
              >
                <FaArrowDown />
              </AwesomeButton>
            </div>
          </div>
        </div>
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
