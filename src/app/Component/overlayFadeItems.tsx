/* eslint-disable @next/next/no-img-element */

import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Heart from "react-animated-heart";

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
  selectedGroupData: any;
  activeFirework: () => any;
}

const OverlayFadeRenderItem = ({
  name,
  genreIds,
  voteAverage,
  content,
  images,
  title,
  selectedGroupData,
  id,
  time,
  index,
  description,
  activeFirework,
  type,
}: Props) => {
  const [isClick, setClick] = useState(false);
  useEffect(() => {
    if (selectedGroupData) {
      setClick(false); // Reset isClick state when id changes
    }
  }, [selectedGroupData]);
  return (
    <div
      className={`${styles.container} hover: hover:origin-center

      duration-500	delay-100 py-3  rounded-2xl `}
    >
      <div className="  ">
        <img src={"/" + images} alt="Example" className="rounded-lg" />
      </div>
      <div
        className={`${styles.overlayRed} top-0 left-0 w-full h-full`}
        onClick={() => {
          setClick(true);
          if (!isClick) {
            activeFirework();
          }
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
