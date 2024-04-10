/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Fade, Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import randomInteger from "random-int";
import { Fireworks } from "fireworks-js";
import Link from "next/link";
import Sun from "../Component/sunmoon";
import Moon from "../Component/moon";

import { AwesomeButton } from "react-awesome-button";
import ReactSwitch from "react-switch";
import { FaSun, FaMoon } from "react-icons/fa"; // Import icon từ thư viện react-icons
import { useSwitch } from "../SwitchContext";

export default function Page() {
  const [running, setRunning] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const { checked } = useSwitch();

  const [isFireworkActive, setIsFireworkActive] = useState(false);

  const slideImages = [
    "./phobo.jpg",
    "./bunbo.jpg",
    "./comga.jpg",
    "./phocuon.jpg",
    "./bonuong.jpg",
    "./garan.jpg",
    "./bittet.jpg",
    "./phoxao.jpg",
    "./pizza.jpg",
    "./nemcuon.jpg",
    "./com123.jpg",
    "./bunrieu.jpg",
    "./bunmoc.jpg",
    "./bunbonambo.jpg",

    // Thêm các hình ảnh slide khác nếu cần
  ];

  const properties = {
    duration: 50, // Khoảng thời gian giữa các slide (đơn vị: ms)
    transitionDuration: 50,
    autoplay: running, // Kích hoạt chế độ tự động chạy
    infinite: running,
    indicators: false,
    arrows: false,
  };

  const toggleRunning = () => {
    setRunning(!running);
    if (!running) {
      setTimeout(() => {
        setRunning(false);
        setShowBox(true);
      }, randomInteger(3000, 10000));
    }
  };

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

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-between relative"
      style={
        checked
          ? { backgroundImage: `url(sunlight.jpg)`, backgroundSize: "cover" }
          : { backgroundImage: `url(nightday.jpg)`, backgroundSize: "cover" }
      }
    >
      <div className="absolute top-11">{checked ? <Sun /> : <Moon />}</div>
      <div className=" mt-44 absolute w-[300px] h-[500px] rounded-2xl">
        <Fade
          {...properties}
          onMouseEnter={undefined}
          onMouseLeave={undefined}
          pauseOnHover={false}
          prevArrow={false}
          className="hide-dots" // Thêm class CSS để tùy chỉnh các dot
        >
          {slideImages.map((fadeImage, index) => (
            <div key={index}>
              <img
                src={fadeImage}
                className="object-fill h-60 w-96 rounded-2xl"
              />
              <h2>{fadeImage.caption}</h2>
            </div>
          ))}
        </Fade>
        {showBox && (
          <img
            src="./gifbox.gif"
            className="absolute top-0 object-fill h-60 z-50 rounded-2xl w-full"
            onClick={() => {
              setShowBox(false);
              setIsFireworkActive(true);
            }}
          />
        )}
      </div>
      {isFireworkActive && (
        <div className="firework container z-[50] absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2" />
      )}
      <Link
        className="mx-4 group text-black-500 transition-all  bottom-20  absolute duration-300 ease-in-out"
        href="/"
      >
        {" "}
        <div className="text-white text-sm">Quay lại</div>{" "}
      </Link>{" "}
      <button
        type="primary"
        disabled={running || showBox}
        className="w-[80%] bottom-28 absolute text-base text-white"
        onClick={toggleRunning}
      >
        Chọn món
      </button>
    </div>
  );
}
