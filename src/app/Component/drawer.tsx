/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";

// import component 👇
import Drawer from "react-modern-drawer";
import { FaTimes } from "react-icons/fa"; // Import icon từ thư viện react-icons

//import styles 👇
import "react-modern-drawer/dist/index.css";
import { useHearthCount } from "../HearthCountContext";
import dynamic from "next/dynamic";
import { useSwitch } from "../SwitchContext";
import PureModal from "react-pure-modal";
import "react-pure-modal/dist/react-pure-modal.min.css";
import { AwesomeButton } from "react-awesome-button";
const data = [
  {
    level: "1",
    hearth: 10,
    reward: "humanpixel",
  },
  {
    level: "2",
    hearth: 15,
    reward: "catpixel",
  },
  {
    level: "3",
    hearth: 30,
    reward: "bunnypixel",
  },

  {
    level: "4",
    hearth: 35,
    reward: "robopixel",
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
];

const DrawerComp = ({ isOpen, setIsOpen }: any) => {
  const [modal, setModal] = useState(false);
  const [unbox, setUnbox] = useState(false);
  const [itemDetail, setItemDetail] = useState<any>();

  const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
    ssr: false,
  });

  const { totalHeartCount } = useHearthCount();
  const { checked } = useSwitch();

  const checkLevelUpText = (item: any) => {
    if (item?.hearth! - totalHeartCount <= 0) {
      return <div className="text-green-400"> Đã đủ số tim để nhận quà</div>;
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
        size={500}
      >
        <div
          className={`w-full h-full rounded-t-[40px] ${
            checked ? "bg-red-700" : "bg-[#0E4F88]"
          }`}
        >
          <div className=" text-white ml-10 pt-10 mb-5">
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
            <div className="text-black grid grid-cols-1 gap-3 w-[100%] px-7 h-[90%] overflow-auto">
              {data?.map((item: any, index) => (
                <div
                  key={index}
                  className={`${
                    item?.hearth! - totalHeartCount > 0 &&
                    "inset-0 opacity-50 z-50"
                  } bg-white shadow-md hover:shadow-xl w-[360px] h-[160px] hover:scale-105 flex justify-around rounded-2xl border`}
                  onClick={() => {
                    item?.hearth! - totalHeartCount <= 0 && setModal(true);
                    setItemDetail(item);
                  }}
                >
                  <div className="w-[100px] mt-7 relative h-[100px] rounded-full bg-red-500">
                    {item?.hearth! - totalHeartCount <= 0 ? (
                      <img
                        src="medal.gif"
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src="award.gif"
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    )}
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
      <PureModal
        header={
          <div className="flex justify-center">
            Chúc mừng bé iu đã nhận được
          </div>
        }
        isOpen={modal}
        closeButtonPosition="bottom"
        onClose={() => {
          setModal(false);
          setUnbox(false);

          return true;
        }}
      >
        {!unbox ? (
          <img
            src="gifbox.gif"
            alt=""
            className="w-full h-full rounded-full object-cover"
            onClick={() => {
              localStorage?.setItem(`petState`, itemDetail?.reward);
              setUnbox(true);
            }}
          />
        ) : (
          <div>
            <img src={itemDetail?.reward + ".gif"} alt="" />
          </div>
        )}
      </PureModal>
    </>
  );
};

export default DrawerComp;
