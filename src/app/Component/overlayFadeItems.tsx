/* eslint-disable @next/next/no-img-element */
// import { Button, Divider } from "antd";
// import React from "react";
// import { Space } from "antd";
// import { StarOutlined } from "@ant-design/icons";

// import { Link, useNavigate } from "react-router-dom";
import Image from "next/image";
import styles from "./styles.module.css";
// import GenresMovies from "../GenresMovies/genresMovies";
import Link from "next/link";
import { useState } from "react";
import Heart from "react-animated-heart";

// import { originalPathPoster } from "@/core/constants";
interface Props {
  name: string;
  id: number;
  images?: any;
  time?: string;
  content?: string;
  index?: number;
  description?: string;
  genreIds?: number[];
  type?: string;
  title: string;
  voteAverage?: number;
  activeFirework: () => any;
}

const OverlayFadeRenderItem = ({
  name,
  genreIds,
  voteAverage,
  content,
  images,
  title,
  id,
  time,
  index,
  description,
  activeFirework,
  type,
}: Props) => {
  const [isClick, setClick] = useState(false);

  return (
    <div className={`${styles.container} hover:scale-105 `}>
      <div className="  ">
        <img src={"/" + images} alt="Example" className="" />
      </div>
      <div
        className={styles.overlayRed}
        onClick={() => {
          setClick(true);
          activeFirework();
        }}
      >
        <div className={`${styles.text} line-clamp-6 grid grid-cols-1`}>
          <div className="flex justify-center">
            <Heart isClick={isClick} onClick={() => setClick(!isClick)} />
          </div>
          <div className="text-xs line-clamp-2 ">{title}</div>
          {/* <div className="text-xs">{formatDate}</div> */}
        </div>
        <div className="absolute top-[55%] left-[17%] w-[220px]">
          {/* <GenresMovies genreIds={genreIds} /> */}
        </div>
      </div>
    </div>
  );
};
export default OverlayFadeRenderItem;
