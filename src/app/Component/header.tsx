"use client";

import { useEffect, useState } from "react";
import ReactSwitch from "react-switch";
import { FaSun, FaMoon } from "react-icons/fa"; // Import icon từ thư viện react-icons
import { useSwitch } from "../context/SwitchContext";
import dynamic from "next/dynamic";
import DrawerComp from "./drawer";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db, firebase_app } from "../firebase/config";
import { FaPhotoFilm } from "react-icons/fa6";
import { getMessaging, getToken } from "firebase/messaging";

const Header = () => {
  const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
    ssr: false,
  }); // Sử dụng dynamic để loại bỏ SSR

  const { checked, handleChange } = useSwitch();
  const [isOpen, setIsOpen] = useState(false);
  const [pictures, setPictures] = useState<number>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if Notifications are supported by the browser
      if (!("Notification" in window)) {
        console.error("This browser does not support desktop notification");
        return;
      }

      // Check if Service Workers are supported by the browser
      if (!("serviceWorker" in navigator)) {
        console.error("Service Workers are not supported by this browser");
        return;
      }

      // Request Notification permission
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            console.log("Notification permission granted.");
            try {
              const messaging = getMessaging(firebase_app);
              // Receive FCM token
              getToken(messaging, {
                vapidKey:
                  "BMV7JAk01-sz_VWlX8g2nHJCh9P1EXVEaiNEyQbmVVsvfXocnW2OhmooZdbChpHEzxLOe35pxfdYDpjyFEWUKN8",
              })
                .then((currentToken) => {
                  if (currentToken) {
                    console.log("Current token:", currentToken);
                    // Send the token to your server to register this device
                  } else {
                    console.log(
                      "No registration token available. Request permission to generate one."
                    );
                  }
                })
                .catch((err) => {
                  console.error(
                    "An error occurred while retrieving token: ",
                    err
                  );
                });
            } catch (err) {
              console.error("An error occurred while getting messaging: ", err);
            }
          } else {
            console.log("Unable to get permission to notify.");
          }
        })
        .catch((err) => {
          console.error(
            "An error occurred while requesting notification permission: ",
            err
          );
        });
    }
  }, []);

  useEffect(() => {
    // Load the initial count from Firestore when the component mounts
    const fetchCount = async () => {
      const docRef = doc(db, "album", "kVP5JboDGkTnorvOi3Yi");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPictures(data?.urls?.length);
      }
    };

    fetchCount();

    // Set up snapshot listener to listen for changes
    const unsubscribe = onSnapshot(
      doc(db, "album", "kVP5JboDGkTnorvOi3Yi"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPictures(data?.urls?.length);
        }
      }
    );

    // Clean up listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div
        className={`text-white rounded-b-full w-[428px] h-10 top-0 fixed items-center justify-around flex z-50 ${
          checked ? "bg-red-700" : "bg-[#0E4F88]"
        } `}
      >
        <span
          className={`w-[60px] h-[27px] rounded-full ${
            checked ? "bg-[#F66602]" : "bg-[#334155]"
          } z-0  flex items-center justify-around`}
        >
          <div
            className="absolute z-50 w-[50px] h-[27px]"
            onClick={() => {
              setIsOpen(true);
            }}
          />

          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center w-full h-full absolute">
              <AnimatedNumbers
                includeComma
                // className={styles.container}
                transitions={(index) => ({
                  type: "spring",
                  duration: index + 1,
                })}
                animateToNumber={pictures!}
                fontStyle={{
                  fontSize: 16,
                  color: "white",
                }}
              />
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center w-full h-full text-white text-lg absolute">
              <FaPhotoFilm />{" "}
            </div>
          </div>
        </span>

        <div className=""> HADIARY </div>

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
      <DrawerComp isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Header;
