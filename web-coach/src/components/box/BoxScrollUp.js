import React from 'react';
import "./BoxScrollUp.css";

interface BoxScrollUpProps {}

const BoxScrollUp: React.FC < BoxScrollUpProps > = () => {

  const scrollToTop = () => {
    document.getElementById("AppContent-content")
      .scroll({
        top: 0,
        behavior: "smooth",
      });
  };

  return (
    <div
      className="BoxScrollUp"
      style={{ zIndex: 200 }}
      onClick={scrollToTop}
    >
      <div className="text-info">
        <i className="h1 bi bi-arrow-up-square-fill"></i>
      </div>
    </div>
  );
};

export default BoxScrollUp;