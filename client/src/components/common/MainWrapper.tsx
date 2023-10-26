import React from "react";
import Footer from "../layout/Footer";

interface props {
  children: React.ReactNode;
}

const MainWrapper: React.FC<props> = ({ children }) => {
  return (
    <div className="h-[94%] w-full">
      <div className="px-6 py-8 overflow-x-hidden overflow-y-scroll h-full w-full flex flex-cols">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default MainWrapper;
