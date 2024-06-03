"use client";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firebase_app } from "../config";
import { useCallback, useEffect, useState } from "react";

export const useGetDocuments = (dataName) => {
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);

  const db = getFirestore(firebase_app);

  const getDoc = useCallback(async () => {
    setloading(true);
    const collectionRef = collection(db, dataName);
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setData(data);
    setloading(false);
  }, [dataName, db]);
  useEffect(() => {
    getDoc();
  }, [getDoc]);

  return { getDoc, data, loading };
};
