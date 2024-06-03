/* eslint-disable @next/next/no-img-element */
import dayjs from "dayjs";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Heart from "react-animated-heart";
import { useHearthCount } from "../context/HearthCountContext";
import addData from "../firebase/firestore/addData";
import { useGetDocuments } from "../firebase/firestore/getData";

interface Props {
  id: number;
  images?: any;
  index?: any;
  description?: string;
  groupId?: string;
  type?: string;
  title: string;
  selectedGroupData: any;
  url?: string;
  activeFirework: () => any;
}

const ImageItem = ({
  images,
  id,
  index,
  groupId,
  activeFirework,
  url,
  selectedGroupData,
  type,
}: Props) => {
  const { handleCount } = useHearthCount();

  console.log("gr", groupId);
  console.log("id", id);

  // Lấy giờ, phút và giây từ thời điểm hiện tại
  // const [playVideo, setPlayVideo] = useState<boolean>(false);
  const [isClick, setClick] = useState<boolean>(() => {
    const storedState = localStorage.getItem(`heartState_${groupId}_${id}`);
    return storedState ? storedState === "true" : false;
  });
  const [count, setCount] = useState<number>(() => {
    const storedCount = localStorage.getItem(`heartCount_${groupId}_${id}`);
    return storedCount ? parseInt(storedCount) : 0;
  });
  const { getDoc, data } = useGetDocuments("hearth");
  const { totalHeartCount } = useHearthCount();

  console.log("sto", totalHeartCount);
  const hearth = data?.map((item: any) => item?.totalHearthCount);
  console.log("hearth", hearth);

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

  const handleAddData = async () => {
    const data = { totalHearthCount: count };

    const { result, error } = await addData(
      "hearth",
      "5btMBFd2iMPLbuTJMOqs",
      data
    );

    if (error) {
      return console.log(error);
    }
    if (result) {
      return console.log(result);
    }
  };

  return (
    <div
      key={index}
      className={`hover: hover:origin-center

      duration-500	delay-100 py-3  rounded-2xl ${styles.container}`}
      // onClick={() => {
      //   url && setPlayVideo((prevState) => !prevState);
      // }}
    >
      <img src={images} alt="Example" className="rounded-lg" />
      <div className={`${styles.overlayRed} top-0 left-0 w-full h-full`}>
        <div className={`${styles.text} grid grid-cols-1`}>
          <div className="flex justify-center w-[px] h-[100px]">
            <div>
              <Heart
                isClick={isClick}
                onClick={() => {
                  setClick(true);
                  handleCount(!isClick);
                  getDoc();
                  handleAddData();
                  setCount((prevCount) =>
                    !isClick ? prevCount + 1 : prevCount
                  );
                  if (!isClick) {
                    activeFirework();
                  }
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
export default ImageItem;
