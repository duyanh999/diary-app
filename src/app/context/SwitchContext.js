// SwitchContext.js
"use client";
import dayjs from "dayjs";
import React, { createContext, useContext, useEffect, useState } from "react";

const SwitchContext = createContext();

export const useSwitch = () => useContext(SwitchContext);

export function SwitchProvider({ children }) {
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    if (dayjs().get("hour") > 6 && dayjs().get("hour") < 17) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, []);
  const handleChange = (isChecked) => {
    setChecked(isChecked);
  };

  return (
    <SwitchContext.Provider value={{ checked, handleChange }}>
      {children}
    </SwitchContext.Provider>
  );
}
