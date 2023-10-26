import React from "react";

const PageWrapper = ({ children }: { children: any }) => {
  return <div className="h-full w-full p-4">{children}</div>;
};

export default PageWrapper;
