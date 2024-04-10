"use client";
import { useState } from "react";
import ReactSwitch from "react-switch";
import { FaSun, FaMoon } from "react-icons/fa"; // Import icon từ thư viện react-icons
import { useSwitch } from "../SwitchContext";
const Header = () => {
  const { checked, handleChange } = useSwitch();

  return (
    <div className="text-white rounded-b-full w-[428px] h-10 top-0 fixed items-center justify-around flex z-50 bg-red-700">
      <div className="ml-[33%]"> HADIARY </div>
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
