import React from "react";
import { Toaster, toast } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/auth");
    setTimeout(
      () => toast.success("logout successfully.", { position: "top-right" }),
      500
    );
  };
  return (
    <div className="w-full h-full flex items-center justify-between px-4 bg-white">
      <NavLink
        to="/"
        className="text-xl italic bg-primary rounded-lg p-2 text-white"
      >
        Task Manager
      </NavLink>

      <div>
        <button
          className="px-2 py-1 border rounded text-white bg-primary "
          onClick={logoutHandler}
          type="button"
        >
          Logout
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default Header;
