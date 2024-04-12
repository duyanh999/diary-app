"use client";

import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";
import { FaSun, FaMoon, FaHeart } from "react-icons/fa"; // Import icon từ thư viện react-icons
import { useSwitch } from "../SwitchContext";
import { useHearthCount } from "../HearthCountContext";
import dynamic from "next/dynamic";

const Header = () => {
  const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
    ssr: false,
  }); // Sử dụng dynamic để loại bỏ SSR

  const { checked, handleChange } = useSwitch();
  const { countContext, handleCount } = useHearthCount();

  console.log("count", countContext);

  const [totalHeartCount, setTotalHeartCount] = useState(0);

  useEffect(() => {
    let totalCount = 0;
    for (let key in localStorage) {
      if (key.startsWith("heartCount_")) {
        const count = parseInt(localStorage.getItem(key) as any);
        totalCount += count;
      }
    }
    setTotalHeartCount(totalCount);
    handleCount(false);
  }, [countContext, handleCount]);

  console.log(totalHeartCount, "total");

  return (
    <div
      className={`text-white rounded-b-full w-[428px] h-10 top-0 fixed items-center justify-around flex z-50 ${
        checked ? "bg-red-700" : "bg-[#0E4F88]"
      } `}
    >
      <span
        className={`w-[60px] h-[27px] rounded-full ${
          checked ? "bg-[#F66602]" : "bg-[#334155]"
        }  flex items-center justify-around`}
      >
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center w-full h-full absolute">
            <AnimatedNumbers
              includeComma
              // className={styles.container}
              transitions={(index) => ({
                type: "spring",
                duration: index + 1,
              })}
              animateToNumber={totalHeartCount}
              fontStyle={{
                fontSize: 16,
                color: "white",
              }}
            />
            {/* {totalHeartCount} */}
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center w-full h-full text-white text-lg absolute">
            <FaHeart />{" "}
          </div>
        </div>
      </span>

      <div className=""> HADIARY </div>
      {/* <div>
        <button onClick={() => setTotalHeartCount((state) => state + 100)}>+</button>
      </div> */}
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
  );
};

export default Header;
