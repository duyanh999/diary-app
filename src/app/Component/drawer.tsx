/* eslint-disable @next/next/no-img-element */
// "use client";
import React, { useState } from "react";

// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import { useHearthCount } from "../HearthCountContext";
import dynamic from "next/dynamic";
import { useSwitch } from "../SwitchContext";

const data = [
  {
    level: "1",
    hearth: 5,
  },
  {
    level: "2",
    hearth: 10,
  },
  {
    level: "3",
    hearth: 15,
  },

  {
    level: "4",
    hearth: 400,
  },
  {
    level: "5",
    hearth: 500,
  },

  {
    level: "6",
    hearth: 600,
  },
  {
    level: "7",
    hearth: 700,
  },
  {
    level: "8",
    hearth: 800,
  },
  {
    level: "9",
    hearth: 900,
  },
  {
    level: "",
    description: "",
  },
];

const DrawerComp = ({ isOpen, setIsOpen }: any) => {
  const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
    ssr: false,
  });

  const { totalHeartCount } = useHearthCount();
  const { checked } = useSwitch();

  const checkLevelUpText = (item: any) => {
    if (item?.hearth! - totalHeartCount < 0) {
      return <div className="text-green-400"> Đã đủ số tim để lên level </div>;
    } else {
      return (
        <>
          Thu thập đủ {item?.hearth! - totalHeartCount} trái tim để lên cấp tiếp
          theo
        </>
      );
    }
  };

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        direction="bottom"
        className="rounded-t-[40px] "
        size={800}
      >
        <div
          className={`w-full h-full rounded-t-[40px] ${
            checked ? "bg-red-700" : "bg-[#0E4F88]"
          }`}
        >
          <div className="w-[40%] h-[20%] text-white relative left-[15%] top-[5%]">
            <div className="text-base font-bold mb-2">Tổng</div>
            <div className="text-5xl font-semibold">
              <AnimatedNumbers
                includeComma
                // className={styles.container}
                transitions={(index) => ({
                  type: "just",
                  duration: index + 3,
                })}
                animateToNumber={totalHeartCount}
                fontStyle={{
                  fontSize: 50,
                  color: "white",
                }}
              />
              <div>Trái Tim</div>
            </div>
          </div>
          <div className="flex justify-center w-full h-full">
            <div className="text-black grid grid-cols-1 mt-5 gap-3 w-[100%] pl-[5%] h-[90%] overflow-auto">
              {data?.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    item?.hearth! - totalHeartCount > 0 &&
                    "inset-0 opacity-50 z-50"
                  } bg-white shadow-md hover:shadow-xl w-[390px] h-[160px] hover:scale-105 flex justify-around rounded-2xl border`}
                >
                  <div className="w-[100px] mt-7 relative h-[100px] rounded-full bg-red-500">
                    <img
                      src="award.gif"
                      alt=""
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="relative w-[60%] my-9">
                    <div className="text-2xl font-semibold">
                      level {item?.level}
                    </div>
                    <div className="text-lg text-slate-400 font-medium">
                      {checkLevelUpText(item) as any}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default DrawerComp;
