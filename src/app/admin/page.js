"use client";
import Link from "next/link";
import React from "react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { useSwitch } from "../context/SwitchContext";
function Page() {
  const { checked } = useSwitch();

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-between relative"
      style={
        checked
          ? { backgroundImage: `url(sunlight.jpg)`, backgroundSize: "cover" }
          : {
              backgroundImage: `url(nightmountain.gif)`,
              backgroundSize: "cover",
            }
      }
    >
      {" "}
      <h1 className="text-black flex justify-center mt-24">
        Only logged in users can view this page
      </h1>
      <div className="flex justify-center">
        <Link className="w-[full] absolute top-[50%]" href="/signin">
          <AwesomeButton> Login </AwesomeButton>
        </Link>
      </div>
    </div>
  );
}

export default Page;
