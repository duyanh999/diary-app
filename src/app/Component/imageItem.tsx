/* eslint-disable @next/next/no-img-element */
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Heart from "react-animated-heart";
import { useHearthCount } from "../context/HearthCountContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust the import path as necessary
import {
  FaFaceDizzy,
  FaFaceKissWinkHeart,
  FaFaceLaughSquint,
} from "react-icons/fa6";
import { FaKissWinkHeart, FaLaughSquint } from "react-icons/fa";

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
  const [count, setCount] = useState<number>(0);
  const [smile, setSmile] = useState<number>(0);
  const [kiss, setKiss] = useState<number>(0);

  useEffect(() => {
    // Load the initial count from Firestore when the component mounts
    const fetchSmile = async () => {
      const docRef = doc(db, "album", "kVP5JboDGkTnorvOi3Yi");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const item = data.urls.find((item: any) => item.id === id);
        if (item) {
          setSmile(item.smile || 0); // Ensure count is a number
        }
      }
    };

    fetchSmile();
  }, [id]);

  const handleAddSmileToFirestore = async () => {
    const docRef = doc(db, "album", "kVP5JboDGkTnorvOi3Yi");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const updatedUrls = data.urls.map((item: any) =>
        item.id === id ? { ...item, smile: (item.smile || 0) + 1 } : item
      );
      await updateDoc(docRef, { urls: updatedUrls });
    }
  };
  useEffect(() => {
    // Load the initial count from Firestore when the component mounts
    const fetchKiss = async () => {
      const docRef = doc(db, "album", "kVP5JboDGkTnorvOi3Yi");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const item = data.urls.find((item: any) => item.id === id);
        if (item) {
          setKiss(item.kiss || 0); // Ensure count is a number
        }
      }
    };

    fetchKiss();
  }, [id]);

  const handleAddKissToFirestore = async () => {
    const docRef = doc(db, "album", "kVP5JboDGkTnorvOi3Yi");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const updatedUrls = data.urls.map((item: any) =>
        item.id === id ? { ...item, kiss: (item.kiss || 0) + 1 } : item
      );
      await updateDoc(docRef, { urls: updatedUrls });
    }
  };
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
      className={`hover: hover:origin-center duration-500 delay-100 py-3 rounded-2xl ${styles.container}`}
    >
      <img src={images} alt="Example" className="rounded-lg" />
      <div className={`${styles.overlayRed} top-0 left-0 w-full h-full`}>
        <div className={`${styles.text} grid grid-cols-1`}>
          <div className="flex justify-center text-3xl cursor-pointer text-blue-500 absolute top-[37.5%]">
            <div>
              <FaLaughSquint
                onClick={() => {
                  setSmile((prevCount) => prevCount + 1);
                  handleAddSmileToFirestore();
                }}
              />
            </div>

            <div
              className={`absolute text-lg mt-[85%] ${
                smile === 0 ? "text-slate-400" : "text-blue-500"
              } `}
            >
              {smile}
            </div>
          </div>
          <div className="flex justify-center text-3xl cursor-pointer text-yellow-500 absolute top-[37.5%] left-[73%]">
            <div>
              <FaKissWinkHeart
                onClick={() => {
                  setKiss((prevCount) => prevCount + 1);
                  handleAddKissToFirestore();
                }}
              />
            </div>

            <div
              className={`absolute text-lg mt-[85%] ${
                kiss === 0 ? "text-slate-400" : "text-yellow-500"
              } `}
            >
              {kiss}
            </div>
          </div>
          <div className="flex justify-center w-[px] h-[100px]">
            <div className="absolute text-xs mt-[15%]">{time}</div>
            <div>
              <Heart
                isClick={true} // Always allow clicking
                onClick={() => {
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
