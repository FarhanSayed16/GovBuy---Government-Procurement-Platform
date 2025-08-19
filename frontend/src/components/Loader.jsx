import React from "react";
import { Ring } from "ldrs/react";
import "ldrs/react/Ring.css";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="spinner">
        <Ring size="40" stroke="5" bgOpacity="0" speed="2" color="black" />
      </div>
    </div>
  );
};

export default Loader;
