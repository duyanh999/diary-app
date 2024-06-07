/* eslint-disable @next/next/no-img-element */
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Heart from "react-animated-heart";
import { useHearthCount } from "../context/HearthCountContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust the import path as necessary

interface Props {
  id: string;
  images?: any;
  index?: any;
  title?: string;
  time?: string;
  activeFirework: () => any;
}

const ImageItem = ({
  images,
  id,
  activeFirework,
  title,
  time,
  index,
}: Props) => {
  const { handleCount } = useHearthCount();
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    // Load the initial count from Firestore when the component mounts
    const fetchCount = async () => {
      const docRef = doc(db, "album", "kVP5JboDGkTnorvOi3Yi");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const item = data.urls.find((item: any) => item.id === id);
        if (item) {
          setCount(item.count || 0); // Ensure count is a number
        }
      }
    };

    fetchCount();
  }, [id]);

  const handleAddCountToFirestore = async () => {
    const docRef = doc(db, "album", "kVP5JboDGkTnorvOi3Yi");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const updatedUrls = data.urls.map((item: any) =>
        item.id === id ? { ...item, count: (item.count || 0) + 1 } : item
      );
      await updateDoc(docRef, { urls: updatedUrls });
    }
  };

  return (
    <div
      key={index}
      className={`hover: hover:origin-center duration-500 delay-100 py-3 rounded-2xl ${styles.container}`}
    >
      <img src={images} alt="Example" className="rounded-lg" />
      <div className={`${styles.overlayRed} top-0 left-0 w-full h-full`}>
        <div className={`${styles.text} grid grid-cols-1`}>
          <div className="flex justify-center w-[px] h-[100px]">
            <div className="absolute text-xs mt-[15%]">{time}</div>
            <div>
              <Heart
                isClick={true} // Always allow clicking
                onClick={() => {
                  handleCount(true);
                  setCount((prevCount) => prevCount + 1);
                  handleAddCountToFirestore();
                  activeFirework();
                }}
              />
            </div>
            <div className="text-white bg-[#2D2D2D] rounded-full p-2 absolute text-lg mt-[90%] whitespace-normal break-words w-[200px]">
              {title}
            </div>
            <div
              className={`absolute text-lg mt-[63%] ${
                count === 0 ? "text-slate-400" : "text-[#E5234C]"
              } `}
            >
              {count}
            </div>
          </div>
        </div>
        <div className="absolute top-[55%] left-[17%] w-[220px]">
          {/* Other content */}
        </div>
      </div>
    </div>
  );
};

export default ImageItem;
