/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";

// import component 👇
import Drawer from "react-modern-drawer";

//import styles 👇
import "react-modern-drawer/dist/index.css";
import { useHearthCount } from "../context/HearthCountContext";
import dynamic from "next/dynamic";
import { useSwitch } from "../context/SwitchContext";
import PureModal from "react-pure-modal";
import "react-pure-modal/dist/react-pure-modal.min.css";
import { dataReward } from "../Data/dataReward";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

import randomInteger from "random-int";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

const DrawerComp = ({ isOpen, setIsOpen }: any) => {
  const [modal, setModal] = useState(false);
  const [unbox, setUnbox] = useState(false);
  const [itemDetail, setItemDetail] = useState<any>();
  const [running, setRunning] = useState(false);
  const [pictures, setPictures] = useState<number>();
  useEffect(() => {
    // Load the initial count from Firestore when the component mounts
    const fetchCount = async () => {
      const docRef = doc(db, "album", "kVP5JboDGkTnorvOi3Yi");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPictures(data?.urls?.length);
      }
    };

    fetchCount();

    // Set up snapshot listener to listen for changes
    const unsubscribe = onSnapshot(
      doc(db, "album", "kVP5JboDGkTnorvOi3Yi"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPictures(data?.urls?.length);
        }
      }
    );

    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, []);
  const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
    ssr: false,
  });

  const { totalHeartCount } = useHearthCount();
  const { checked } = useSwitch();

  const properties = {
    duration: 50, // Khoảng thời gian giữa các slide (đơn vị: ms)
    transitionDuration: 50,
    autoplay: running, // Kích hoạt chế độ tự động chạy
    infinite: running,
    indicators: false,
    arrows: false,
  };

  const dataMoney = ["./200k.jpg", "./500k.jpg"];
  const checkLevelUpText = (item: any) => {
    if (item?.hearth! - pictures! <= 0) {
      return <div className="text-green-400"> Đã đủ số ảnh để nhận quà</div>;
    } else {
      return <>Đăng {item?.hearth! - pictures!} ảnh để lên cấp tiếp theo</>;
    }
  };

  const checkImage = (item: any) => {
    if (item?.includes("money")) {
      return (
        <Fade
          {...properties}
          defaultIndex={0}
          pauseOnHover={false}
          prevArrow={false as any}
        >
          {dataMoney?.map((fadeImage, index) => (
            <div key={index}>
              <img
                src={fadeImage}
                className="object-fill h-60 w-96 rounded-2xl"
              />
            </div>
          ))}
        </Fade>
      );
    }
    if (item?.includes("jpg")) {
      return <img src={item + ".jpg"} alt="" />;
    } else {
      return <img src={item + ".gif"} alt="" />;
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
                animateToNumber={pictures!}
                fontStyle={{
                  fontSize: 50,
                  color: "white",
                }}
              />
              <div>Ảnh & Video</div>
            </div>
          </div>
          <div className="flex justify-center w-full h-full">
            <div className="text-black grid grid-cols-1 gap-3 w-[100%] px-7 h-[90%] overflow-auto">
              {dataReward?.map((item: any, index) => (
                <div
                  key={index}
                  className={`${
                    item?.hearth! - pictures! > 0 && "inset-0 opacity-50 z-50"
                  } bg-white shadow-md hover:shadow-xl w-[360px] h-[160px] hover:scale-105 flex justify-around rounded-2xl border`}
                  onClick={() => {
                    item?.hearth! - pictures! <= 0 && setModal(true);
                    setItemDetail(item);
                  }}
                >
                  <div className="w-[100px] mt-7 relative h-[100px] rounded-full bg-red-500">
                    {item?.hearth! - pictures! <= 0 ? (
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
              setRunning(!running);
              if (!running) {
                setTimeout(() => {
                  setRunning(false);
                  // setShowBox(true);
                }, randomInteger(3000, 10000));
              }
            }}
          />
        ) : (
          <div>{checkImage(itemDetail?.reward) as any}</div>
        )}
      </PureModal>
    </>
  );
};

export default DrawerComp;
