/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OverlayFadeRenderItem from "./Component/overlayFadeItems";
import { Fireworks } from "fireworks-js";
import Link from "next/link";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import Confetti from "react-confetti";
import { useSwitch } from "./context/SwitchContext";
import { isYesterday } from "date-fns/isYesterday";
import dayjs from "dayjs";
import { groupedData } from "./Data/dataMain";
import ProgressBar from "@ramonak/react-progress-bar";
import { dataReward } from "./Data/dataReward";
import { useHearthCount } from "./context/HearthCountContext";
import { FaHeart } from "react-icons/fa";
import { useAuthContext } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { auth, firebase_app, storage } from "./firebase/config";
import { signOut } from "firebase/auth";
import addData from "./firebase/firestore/addData";
import getData, { useGetDocuments } from "./firebase/firestore/getData";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getFirestore,
} from "firebase/firestore";
import ImageItem from "./Component/imageItem";

export default function Home() {
  // const { width, height } = useWindowSize();
  const { checked } = useSwitch();
  const { user } = useAuthContext();
  const router = useRouter();
  const db = getFirestore(firebase_app);

  const [scrollHeight, setScrollHeight] = useState(0);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedGroupData, setSelectedGroupData] = useState([]);
  const [runScreen, setRunScreen] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isFireworkActive, setIsFireworkActive] = useState(false);
  const { totalHeartCount } = useHearthCount();
  const [isPet, setPet] = useState("");
  const [closestObject, setClosestObject] = useState(null);
  const [minDifference, setMinDifference] = useState(Infinity);
  const [image, setImage] = useState(null);
  const [base64, setBase64] = useState("");

  const { getDoc, data, loading } = useGetDocuments("album");

  const levelEXP = closestObject?.level - 1;
  const heartEXP = closestObject?.hearth;

  const dataUrls = data?.map((item) => item?.urls);
  // const handleGroupChange = (event) => {
  //   const selectedGroup = event.target.value;
  //   setSelectedGroup(selectedGroup);
  //   setSelectedGroupData(groupedData[selectedGroup] || []);
  // };

  useEffect(() => {
    if (user == null) router.push("/admin");
  }, [router, user]);

  useEffect(() => {
    const storedState = localStorage?.getItem(`petState`);
    setPet(storedState);
  }, [setPet]);

  useEffect(() => {
    dataReward.forEach((item) => {
      // Đảm bảo 'hearth' lớn hơn targetHearth
      if (item.hearth > totalHeartCount) {
        const difference = item.hearth - totalHeartCount;
        // So sánh sự khác biệt
        if (difference < minDifference) {
          setMinDifference(difference);
          setClosestObject(item);
        }
      }
    });
  }, [minDifference, totalHeartCount]);

  useEffect(() => {
    const day = localStorage.getItem("day");
    if (isYesterday(day)) {
      for (let i = 0; i < localStorage.length; i++) {
        // Get the key
        const key = localStorage.key(i);
        // Check if the key is related to Hearth State
        if (key && key.startsWith("heartState_")) {
          // Set the value of the key to false
          localStorage.setItem(key, "false");
        }
      }
      localStorage.setItem("day", dayjs()?.toString());
    } else {
      localStorage.setItem("day", dayjs()?.toString());
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight } = scrollRef.current;
      const length = scrollHeight;
      setScrollHeight(length);
    }
  }, [selectedGroupData.length]);

  const scrollRef = useRef(null);
  useEffect(() => {
    if (runScreen) {
      const intervalId = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 424);
      }, 1000); // Thay đổi khoảng thời gian tăng giá trị ở đây, đơn vị là milliseconds (1000ms = 1 giây)

      // Clear interval khi component unmount
      return () => clearInterval(intervalId);
    }
  }, [counter, runScreen, scrollHeight]); // Tham số thứ hai của

  useEffect(() => {
    if (data) {
      scrollRef.current.scrollTo({
        top: dataUrls[0]?.length * 424,
        behavior: "smooth",
      });
    }
  }, [data, dataUrls]);

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
  console.log("lenght", dataUrls[0]?.length);
  useEffect(() => {
    if (isFireworkActive) {
      const stopFireworks = setTimeout(() => {
        setIsFireworkActive(false);
      }, 10000);

      // Clear the timeout to stop the fireworks if component unmounts or isFireworkActive changes
      return () => clearTimeout(stopFireworks);
    }
  }, [isFireworkActive]);

  const handleFireworkActivation = () => {
    setIsFireworkActive(true);
  };

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth);
  //     router.push("/login"); // Điều hướng về trang login sau khi đăng xuất
  //   } catch (error) {
  //     console.error("Error logging out: ", error);
  //   }
  // };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result);
      };
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const renderPet = useCallback((item) => {
    switch (item) {
      case "catpixel":
        return (
          <img
            src={"./catpixel.gif"}
            alt="dsad"
            className="absolute top-[20%]"
          />
        );
      case "bunnypixel":
        return (
          <img
            src={"./bunnypixel.gif"}
            alt="dsad"
            className="absolute top-[10%]"
          />
        );
      case "humanpixel":
        return <img src={"./humanpixel.gif"} className="absolute top-[35%]" />;
      case "robopixel":
        return <img src={"./robopixel.gif"} className="absolute top-[35%]" />;
      default:
      // code block
    }
  }, []);

  const handleForm = async () => {
    const data = { totalHearthCount: 100 };
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);
      clearFileInput();
      try {
        await uploadString(storageRef, base64, "data_url");
        const url = await getDownloadURL(storageRef);

        // Store the image URL in Firestore
        const { result, error } = await addData(
          "album",
          "kVP5JboDGkTnorvOi3Yi",
          { url }
        );

        const ref = doc(db, "album", "kVP5JboDGkTnorvOi3Yi");
        await updateDoc(ref, {
          urls: arrayUnion({ url }),
        });

        if (error) {
          console.error("Error writing document: ", error);
        } else {
          console.log(result);
          fetchData();
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
  const renderItemImage = (item, groupKey, index) => {
    return (
      <ImageItem
        index={index}
        id={item.id}
        groupId={groupKey}
        title={item.title}
        images={item.url}
        url={item?.url}
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
            {data?.map((item) => item?.urls?.map(renderItemImage))}
            {loading && (
              <div className="absolute z-99">
                loading..loading...loading...loading...loading...loading...loading...loading...loading...loading...loading...loading...loading....
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between bg-no-repeat	h-full p-5 relative"
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

      {!selectedGroup && (
        <div className="flex w-full justify-center mt-3">
          <ProgressBar
            completed={totalHeartCount}
            maxCompleted={heartEXP}
            className=" mt-[5%] w-[60%]"
          />
          <div
            className="flex items-center ml-[1%] mt-2 bg-no-repeat justify-center rounded-full p-6"
            style={{
              backgroundImage: `url(circle.gif)`,
              backgroundSize: "contain",
            }}
          >
            <span className="absolute text-white font-semibold">
              lv{levelEXP}
            </span>
          </div>
        </div>
      )}
      {!selectedGroup && renderPet(isPet)}
      {/* {isFireworkActive && (
        <div className="firework container z-[50] absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2" />
      )} */}
      <div className="relative flex-1 ">
        {suggestUserChoiceList()}{" "}
        <div className="flex mt-4 justify-center">
          <AwesomeButton type={`${checked ? "danger" : "link"}`}>
            <input type="file" id="fileInput" onChange={handleImageChange} />
          </AwesomeButton>
          <AwesomeButton
            type={`${checked ? "danger" : "link"}`}
            onPress={handleForm}
            disabled={!image}
          >
            UP
          </AwesomeButton>
        </div>
      </div>
      {selectedGroup && (
        <AwesomeButton
          className="bottom-24 absolute w-full"
          type={`${checked ? "danger" : "link"}`}
          onPress={() => {
            setRunScreen((prevRunScreen) => !prevRunScreen);
          }}
        >
          <span className="bg-left-bottom text-base font-bold bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
            {runScreen ? "Dừng thước phim" : " Chạy thước phim"}
          </span>
        </AwesomeButton>
      )}
      {/* <Link className="w-[full] bottom-20 absolute" href="/gacha">
        <span className="bg-left-bottom text-white text-base font-semibold bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
          Hôm nay em ăn gì?
        </span>
      </Link> */}
    </main>
  );
}
