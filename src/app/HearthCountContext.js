// SwitchContext.js
"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const HearthCountContext = createContext();

export const useHearthCount = () => useContext(HearthCountContext);

export function HearthCountProvider({ children }) {
  const [countContext, setCountContext] = useState(false);

  const handleCount = useCallback((isCount) => {
    setCountContext(isCount);
  }, []);
  const [totalHeartCount, setTotalHeartCount] = useState(0);

  useEffect(() => {
    let totalCount = 0;
    for (let key in localStorage) {
      if (key.startsWith("heartCount_")) {
        const count = parseInt(localStorage.getItem(key));
        totalCount += count;
      }
    }
    setTotalHeartCount(totalCount);
    handleCount(false);
  }, [countContext, handleCount]);

  return (
    <HearthCountContext.Provider
      value={{ countContext, handleCount, totalHeartCount }}
    >
      {children}
    </HearthCountContext.Provider>
  );
}
