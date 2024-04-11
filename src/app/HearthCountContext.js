// SwitchContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const HearthCountContext = createContext();

export const useHearthCount = () => useContext(HearthCountContext);

export function HearthCountProvider({ children }) {
  const [countContext, setCountContext] = useState(false);

  const handleCount = (isCount) => {
    setCountContext(isCount);
  };

  return (
    <HearthCountContext.Provider value={{ countContext, handleCount }}>
      {children}
    </HearthCountContext.Provider>
  );
}
