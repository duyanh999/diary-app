"use client";

import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";
import { FaSun, FaMoon } from "react-icons/fa"; // Import icon từ thư viện react-icons
import { useSwitch } from "../context/SwitchContext";
import dynamic from "next/dynamic";
import DrawerComp from "./drawer";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { FaPhotoFilm } from "react-icons/fa6";

const Header = () => {
  const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
    ssr: false,
  }); // Sử dụng dynamic để loại bỏ SSR

  const { checked, handleChange } = useSwitch();
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <>
      <div
        className={`text-white rounded-b-full w-[428px] h-10 top-0 fixed items-center justify-around flex z-50 ${
          checked ? "bg-red-700" : "bg-[#0E4F88]"
        } `}
      >
        <span
          className={`w-[60px] h-[27px] rounded-full ${
            checked ? "bg-[#F66602]" : "bg-[#334155]"
          } z-0  flex items-center justify-around`}
        >
          <div
            className="absolute z-50 w-[50px] h-[27px]"
            onClick={() => {
              setIsOpen(true);
            }}
          />

          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center w-full h-full absolute">
              <AnimatedNumbers
                includeComma
                // className={styles.container}
                transitions={(index) => ({
                  type: "spring",
                  duration: index + 1,
                })}
                animateToNumber={pictures!}
                fontStyle={{
                  fontSize: 16,
                  color: "white",
                }}
              />
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center w-full h-full text-white text-lg absolute">
              <FaPhotoFilm />{" "}
            </div>
          </div>
        </span>

        <div className=""> HADIARY </div>

        <div className="flex justify-start">
          <div>
            <ReactSwitch
              onChange={handleChange}
              checked={checked}
              offColor="#334155"
              onColor={"#F66602"}
              checkedIcon={
                <div className="flex justify-center items-center w-full h-full text-white text-lg">
                  <FaSun />
                </div>
              }
              uncheckedIcon={
                <div className="flex justify-center items-center w-full h-full text-white text-lg">
                  <FaMoon />{" "}
                </div>
              }
            />
          </div>
        </div>
      </div>
      <DrawerComp isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Header;
