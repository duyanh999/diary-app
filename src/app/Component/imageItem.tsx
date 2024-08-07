/* eslint-disable @next/next/no-img-element */
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Heart from "react-animated-heart";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust the import path as necessary
import { FaCloudArrowDown } from "react-icons/fa6";
import { FaKissWinkHeart, FaLaughSquint } from "react-icons/fa";
import { useSwitch } from "../context/SwitchContext";
import Image from "next/image";

interface Props {
  id: string;
  images?: any;
  index?: any;
  title?: string;
  time?: string;
  gridView: boolean;
  activeFirework: () => any;
  handleUpdateIndexImage: (index: any) => void;
}

const ImageItem = ({
  images,
  id,
  activeFirework,
  title,
  time,
  index,
  gridView,
  handleUpdateIndexImage,
}: Props) => {
  const [count, setCount] = useState<number>(0);
  const [smile, setSmile] = useState<number>(0);
  const [kiss, setKiss] = useState<number>(0);
  const { checked } = useSwitch();

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

  const downloadImage = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = urlBlob;
    a.download = "image.jpg"; // Bạn có thể đặt tên cho ảnh theo nhu cầu
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(urlBlob);
  };

  return (
    <div
      onClick={() => {
        handleUpdateIndexImage(index);
      }}
      className={`hover: hover:origin-center duration-500 delay-100 py-3 rounded-2xl ${
        gridView && "h-[150px] px-1"
      }  ${styles.container}`}
    >
      {images?.includes("MOV") ? (
        <img
          src={images}
          alt="Example"
          className={`rounded-lg ${!gridView && "h-[400px]"} `}
        />
      ) : (
        <Image
          src={images}
          alt="Example"
          width={400}
          height={400}
          blurDataURL={"/pizza.jpg"}
          placeholder="blur"
          className={`rounded-lg ${!gridView && "h-[400px]"} `}
        />
      )}

      <div
        className={`${
          !gridView && (checked ? styles.overlayRed : styles.overlayBlack)
        } top-0 left-0 w-full h-full`}
      >
        {!gridView && (
          <>
            <div
              className={`flex justify-center text-3xl cursor-pointer ${
                checked ? "text-[#2D2D2D]" : "text-slate-200"
              }  absolute top-4 right-4`}
            >
              <FaCloudArrowDown onClick={() => downloadImage(images)} />
            </div>
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
              <div className="flex justify-center text-3xl cursor-pointer text-pink-600 absolute top-[37.5%] left-[73%]">
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
                    kiss === 0 ? "text-slate-400" : "text-pink-600"
                  } `}
                >
                  {kiss}
                </div>
              </div>
              <div className="flex justify-center w-[px] h-[100px]">
                <div className="absolute text-white text-xs mt-[15%]">
                  {time}
                </div>
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
          </>
        )}

        <div className="absolute top-[55%] left-[17%] w-[220px]">
          {/* Other content */}
        </div>
      </div>
    </div>
  );
};

export default ImageItem;
