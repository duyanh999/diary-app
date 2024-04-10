import React from "react";

const Sun = () => {
  const sunStyle = {
    width: "100px",
    height: "100px",
    backgroundColor: "yellow",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    animation: "moveSun 200s linear infinite", // Sửa 'inear' thành 'linear'
  };

  const moveSunKeyframes = `
    @keyframes moveSun {
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
      <style>{moveSunKeyframes}</style>
      <div style={sunStyle}></div>
    </div>
  );
};

export default Sun;
