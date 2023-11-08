import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-lightBlack w-full text-center py-2 align-self-bottom">
      Copyright Ⓒ {new Date().getFullYear()}
    </footer>
  );
};

export default Footer;
