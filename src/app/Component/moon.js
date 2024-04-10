import React from "react";

const Moon = () => {
  const moonStyle = {
    width: "100px",
    height: "100px",
    backgroundColor: "lightgray",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    animation: "moveMoon 200s linear infinite", // Sửa 'inear' thành 'linear'
  };

  const moveMoonKeyframes = `
    @keyframes moveMoon {
      0% {
        transform: translateX(-10px) rotate(0deg);
      }
      100% {
        transform: translateX(120px) rotate(180deg);
      }
    }
  `;

  return (
    <div>
      <style>{moveMoonKeyframes}</style>
      <div style={moonStyle}></div>
    </div>
  );
};

export default Moon;
