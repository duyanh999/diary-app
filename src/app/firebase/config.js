"use client";
import { useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

let messaging;
const firebaseConfig = {
  apiKey: "AIzaSyBuBgOfdD0k_QtunUVZY4wXdfVm-t8onRQ",
  authDomain: "hadiary-5e17e.firebaseapp.com",
  projectId: "hadiary-5e17e",
  storageBucket: "hadiary-5e17e.appspot.com",
  messagingSenderId: "162213869252",
  appId: "1:162213869252:web:cdf5b327fe7b0ad633fb91",
  measurementId: "G-5SNMZXWZFY",
};

const firebase_app = initializeApp(firebaseConfig);
const db = getFirestore(firebase_app);
const storage = getStorage(firebase_app);
const auth = getAuth(firebase_app);

export { auth, firebase_app, db, storage };

export default function FirebaseMessaging() {
  useEffect(() => {
    async function initializeMessaging() {
      const { getMessaging } = await import("firebase/messaging");

      if (typeof window !== "undefined" && navigator) {
        messaging = getMessaging(firebase_app);
      }
    }

    initializeMessaging();
  }, []);

  return null;
}
