import React from "react";
import Login from "./Login";
import Signup from "./Signup";
import { useAppSelector } from "../../redux/hooks";
import { authInitials } from "../../redux/authSlice";
import OTPVerification from "./OTPVerification";

const Auth = () => {
  const authState = useAppSelector((state) => state.auth) as authInitials;

  return (
    <section className="flex flex-row w-screen h-screen overflow-x-hidden ">
      <div className="w-[60%] flex items-center justify-center">
        <img
          src="/images/auth-bg.avif"
          alt="analytic"
          className=" h-[70%] select-none "
          draggable={false}
        />
      </div>
      <div className="w-[40%] flex items-center justify-center">
        {authState.mode === "login" && <Login />}
        {authState.mode === "signup" && authState.email === "" && <Signup />}
        {authState.mode === "signup" && authState.email !== "" && (
          <OTPVerification />
        )}
      </div>
    </section>
  );
};

export default Auth;
