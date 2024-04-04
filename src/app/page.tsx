"use client";
import { useCallback, useEffect, useState } from "react";
import OverlayFadeRenderItem from "./Component/overlayFadeItems";
import { Fireworks } from "fireworks-js";

const data = [
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
];

export default function Home() {
  const [isFireworkActive, setIsFireworkActive] = useState(false);

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
      }, 5000);

      // Clear the timeout to stop the fireworks if component unmounts or isFireworkActive changes
      return () => clearTimeout(stopFireworks);
    }
  }, [isFireworkActive]);

  const handleFireworkActivation = () => {
    // console.log("dsada");
    setIsFireworkActive(true);
  };

  console.log(isFireworkActive);

  const renderPosterMovies = (item: any) => {
    return (
      <OverlayFadeRenderItem
        id={item?.id}
        title={item?.title}
        name={item?.original_title}
        images={item?.image}
        genreIds={item?.genre_ids}
        voteAverage={item?.vote_average}
        activeFirework={handleFireworkActivation}
      />
    );
  };
  const suggestUserChoiceList = () => {
    return (
      <div className="">
        <div className="grid place-content-center gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className=" text-xs text-white flex justify-center">
            Ngày 29/3/2024
          </div>
          <div className="items-center flex justify-center">
            {" "}
            <div className="rounded-full bg-red-700 w-[10px]  h-[10px]"> </div>
          </div>
          {data?.map(renderPosterMovies)}
        </div>
      </div>
    );
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-20 relative">
      {/* Add class "container" here */}
      {/* Ensure the container has position:relative to establish stacking context */}
      {isFireworkActive && (
        <div className="firework container z-[50] absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2" />
      )}
      {/* Place your fireworks here */}
      {/* <CarouselMovie dataPopularMovies={popularMovies} /> */}
      <div className="relative flex-1">{suggestUserChoiceList()}</div>
      {/* Make sure to add z-index to the suggest to ensure it is above other content */}
    </main>
  );
}
