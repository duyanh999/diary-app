/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import OverlayFadeRenderItem from "./Component/overlayFadeItems";
import { Fireworks } from "fireworks-js";
import Link from "next/link";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import Confetti from "react-confetti";
const groupedData = {
  Oceanpark: [
    {
      id: "1",
      name: "duyhuong",
      image: "huong.png",
      title: "Người mẫu và lon bia",
      genreIds: "",
      voteAverage: "2",
    },
    {
      id: "1",
      name: "duyhuong",
      image: "duyanhhuong.jpg",
      title: "Đẹp đôi 10 điểm",
      genreIds: "",
      voteAverage: "2",
    },
    {
      id: "1",
      name: "duyhuong",
      image: "huong2.jpg",
      title: "Người mẫu dễ thương nhất",
      genreIds: "",
      voteAverage: "2",
    },
    {
      id: "1",
      name: "duyhuong",
      image: "huong3.jpg",
      title: "Người mẫu thần thái 10 điểm",
      genreIds: "",
      voteAverage: "2",
    },
  ],
  Pizza4P: [
    {
      id: "1",
      name: "duyhuong",
      image: "4p1.jpg",
      title: "Người mẫu và máy ảnh",
      genreIds: "",
      voteAverage: "2",
    },
    {
      id: "1",
      name: "duyhuong",
      image: "4p2.jpg",
      title: "Xinh gái 10 điểm",
      genreIds: "",
      voteAverage: "2",
    },
    {
      id: "1",
      name: "duyhuongdấdas",
      image: "4p3.jpg",
      title: "Dễ thương nhất",
      genreIds: "",
      voteAverage: "2",
    },
    {
      id: "1",
      name: "duyhuong",
      image: "4p4.jpg",
      title: "Gia trưởng yêu anh",
      genreIds: "",
      voteAverage: "2",
    },
  ],
  AeonMall: [
    {
      id: "1",
      name: "duyhuong",
      image: "aeon1.jpg",
      title: "Đẹp đôi cool ngầu",
      genreIds: "",
      voteAverage: "2",
    },
    {
      id: "1",
      name: "duyhuong",
      image: "aeon2.jpg",
      title: "Tổng tài xinh gái yêu anh",
      genreIds: "",
      voteAverage: "2",
    },
    {
      id: "1",
      name: "duyhuongdấdas",
      image: "aeon3.jpg",
      title: "Đẹp đôi dễ thương",
      genreIds: "",
      voteAverage: "2",
    },
    {
      id: "1",
      name: "duyhuong",
      image: "aeon4.jpg",
      title: "đẹp trai xinh gái",
      genreIds: "",
      voteAverage: "2",
    },
  ],
};

export default function Home() {
  // const { width, height } = useWindowSize();

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedGroupData, setSelectedGroupData] = useState([]);
  const [isClick, setClick] = useState(false);

  const handleGroupChange = (event) => {
    const selectedGroup = event.target.value;
    setSelectedGroup(selectedGroup);
    setSelectedGroupData(groupedData[selectedGroup] || []);
  };
  const [isFireworkActive, setIsFireworkActive] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    let startY = 0;

    const handleTouchStart = (event) => {
      startY = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      event.preventDefault(); // Ngăn chặn cuộn mặc định

      const deltaY = event.touches[0].clientY - startY;
      const itemHeight =
        scrollRef.current.scrollHeight / selectedGroupData.length;

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
        scrollRef.current.removeEventListener("touchstart", handleTouchStart);
        scrollRef.current.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [selectedGroupData]);

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

  const renderPosterMovies = (item) => {
    return (
      <OverlayFadeRenderItem
        id={item?.id}
        title={item?.title}
        name={item?.original_title}
        images={item?.image}
        genreIds={item?.genre_ids}
        voteAverage={item?.vote_average}
        activeFirework={handleFireworkActivation}
        selectedGroupData={selectedGroupData}
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
            {selectedGroupData.map(renderPosterMovies)}
          </div>
        </div>
      </div>
    );
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5 relative">
      {/* <div className="text-white text-3xl mb-5">Yêu Hương</div> */}
      <div className="relative">
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
      </div>
      {/* {isFireworkActive && (
        <div className="firework container z-[50] absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2" />
      )} */}
      <div className="relative flex-1 ">{suggestUserChoiceList()} </div>
      <Link className="w-[full] bottom-24 absolute" href="/gacha">
        <AwesomeButton type="link" className="">
          <span className="bg-left-bottom text-base font-bold bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
            Hôm nay em ăn gì
          </span>
        </AwesomeButton>
      </Link>
    </main>
  );
}
