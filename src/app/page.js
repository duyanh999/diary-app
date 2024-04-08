/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import OverlayFadeRenderItem from "./Component/overlayFadeItems";
import { Fireworks } from "fireworks-js";
import Heart from "react-animated-heart";
import Image from "next/image";
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
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedGroupData, setSelectedGroupData] = useState([]);
  const [isClick, setClick] = useState(false);

  const handleGroupChange = (event) => {
    const selectedGroup = event.target.value;
    setSelectedGroup(selectedGroup);
    setSelectedGroupData(groupedData[selectedGroup] || []);
  };
  const [isFireworkActive, setIsFireworkActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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
      const container = document?.querySelector(".container");
      if (!container) return; // Make sure container is available
      const fireworks = new Fireworks(container, {
        autoresize: true,
        opacity: 0.5,
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 309,
        traceLength: 30,
        traceSpeed: 10,
        explosion: 15,
        intensity: 30,
        flickering: 50,
        lineStyle: "square",
        hue: {
          min: 0,
          max: 360,
        },
        delay: {
          min: 30,
          max: 60,
        },
        rocketsPoint: {
          min: 0,
          max: 100,
        },
        lineWidth: {
          explosion: {
            min: 1,
            max: 3,
          },
          trace: {
            min: 1,
            max: 2,
          },
        },
        brightness: {
          min: 50,
          max: 80,
        },
        decay: {
          min: 0.015,
          max: 0.03,
        },
        mouse: {
          click: false,
          move: false,
          max: 1,
        },
      });
      fireworks.start();

      // Stop the fireworks after 5 seconds
      const stopFireworks = setTimeout(() => {
        fireworks.stop();
        setIsFireworkActive(false);
      }, 2000);

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

      {isFireworkActive && (
        <div className="firework container z-[50] absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2" />
      )}

      <div className="relative flex-1 ">{suggestUserChoiceList()}</div>
      {/* <div className=" text-white">Hôm nay em ăn gì</div> */}
    </main>
  );
}
