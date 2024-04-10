// SwitchContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const SwitchContext = createContext();

export const useSwitch = () => useContext(SwitchContext);

export function SwitchProvider({ children }) {
  const [checked, setChecked] = useState(false);

  const handleChange = (isChecked) => {
    setChecked(isChecked);
  };

  return (
    <SwitchContext.Provider value={{ checked, handleChange }}>
      {children}
    </SwitchContext.Provider>
  );
}
