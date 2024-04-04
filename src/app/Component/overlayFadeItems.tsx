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
// import image from "../../Asset/huong.png";

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
  type,
}: Props) => {
  return (
    <div className={`${styles.container}  hover:scale-105`}>
      <img
        src={"/" + images}
        alt="Example"
        className="h-[350px] object-cover"
      />
      <div className={styles.overlayRed}>
        <div className={`${styles.text} line-clamp-6 grid grid-cols-1`}>
          <div className="text-xs line-clamp-2">{title}</div>
          <div className="flex justify-center">
            {voteAverage?.toFixed(1)}
            {type !== "suggestAdmin" && (
              <img alt="" src={""} className="w-[20%] ml-1" />
            )}
          </div>
          <Link prefetch={true} href={`movies/${id}`}>
            {/* <Button className="text-white mt-3">Detail</Button> */}
          </Link>
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
