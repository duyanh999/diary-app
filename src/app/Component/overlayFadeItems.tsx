/* eslint-disable @next/next/no-img-element */
import dayjs from "dayjs";
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
  groupId?: string;
  type?: string;
  title: string;
  voteAverage?: number;
  selectedGroupData: any;
  activeFirework: () => any;
}

const OverlayFadeRenderItem = ({
  images,
  id,
  groupId,
  activeFirework,
  selectedGroupData,
  type,
}: Props) => {
  console.log(groupId);
  const [isClick, setClick] = useState<boolean>(() => {
    const storedState = localStorage.getItem(`heartState_${groupId}_${id}`);
    return storedState ? storedState === "true" : false;
  });
  const [count, setCount] = useState<number>(() => {
    const storedCount = localStorage.getItem(`heartCount_${groupId}_${id}`);
    return storedCount ? parseInt(storedCount) : 0;
  });

  useEffect(() => {
    const storedState = localStorage.getItem(`heartState_${groupId}_${id}`);
    setClick(storedState ? storedState === "true" : false);

    const storedCount = localStorage.getItem(`heartCount_${groupId}_${id}`);
    setCount(storedCount ? parseInt(storedCount) : 0);
  }, [groupId, id]);

  useEffect(() => {
    localStorage.setItem(`heartCount_${groupId}_${id}`, count.toString());
  }, [count, groupId, id]);

  useEffect(() => {
    localStorage.setItem(`heartState_${groupId}_${id}`, isClick.toString());
  }, [isClick, groupId, id]);

  useEffect(() => {
    const currentDate = dayjs();
    const tomorrowDate = dayjs().add(1, "day");
    const isTomorrow = currentDate.isBefore(tomorrowDate, "day");
    if (!isTomorrow) {
      setClick(false);
    }
  }, []);

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
          if (!isClick) {
            activeFirework();
          }
        }}
      >
        <div className={`${styles.text} grid grid-cols-1`}>
          <div className="flex justify-center w-[px] h-[100px]">
            <div>
              <Heart
                isClick={isClick}
                onClick={() => {
                  setClick(true);
                  setCount((prevCount) =>
                    !isClick ? prevCount + 1 : prevCount
                  );
                }}
              />
            </div>
            <div
              className={`absolute text-lg mt-[63%] ${
                isClick === false ? "text-slate-400" : "text-[#E5234C]"
              } `}
            >
              {count}
            </div>
          </div>
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
