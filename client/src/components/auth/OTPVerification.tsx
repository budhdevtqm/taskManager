import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { MdEmail } from "react-icons/md";
import { Otptimer } from "otp-timer-ts";
import {
  authInitials,
  resendOTP,
  toggleMode,
  verifyOTP,
  removeMail,
} from "../../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Toaster, toast } from "react-hot-toast";

const OTPVerification = () => {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<string>("");
  const auth = useAppSelector((state) => state.auth) as authInitials;
  const dispatch = useAppDispatch();

  const resendHandler = async () => {
    const response: any = await dispatch(resendOTP({ email: auth.email }));
    if (response.type === "/resend/fulfilled") {
      toast.success(response.payload.data.message, { position: "top-right" });
      setOtp("");
      return;
    }
  };

  const verifyHandler = async (
    e: React.FormEvent<HTMLFormElement>,
    values: { email: string; otp: string }
  ) => {
    e.preventDefault();
    const response: any = await dispatch(verifyOTP(values));
    if (response.payload === undefined) {
      toast.error("Invalid OTP", { position: "top-right" });
      return;
    } else {
      toast.success("OTP verified, Please Login.", { position: "top-right" });
      setTimeout(() => {
        dispatch(toggleMode());
        dispatch(removeMail());
        return;
      }, 1000);
    }
  };

  return (
    <section className="bg-primary rounded w-[70%] px-8 py-16 text-white flex flex-col gap-4 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
      <div>
        <h1 className="flex items-center justify-center text-8xl px-auto py-2 my-1 ">
          <MdEmail />
        </h1>
        <p className="text-center text-[13px]">
          OTP is sent on your email, Please check.
        </p>
      </div>
      <form
        className="flex flex-col gap-8"
        onSubmit={(e) => verifyHandler(e, { email: auth.email, otp })}
      >
        <div className="flex items-center justify-center gap-2">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span>-</span>}
            renderInput={(props: any) => (
              <input {...props} className="mx-4 h-[20px] text-black" />
            )}
          />
        </div>
        <div className="text-center">
          <Otptimer
            minutes={2}
            seconds={0}
            onResend={resendHandler}
            buttonClass="border rounded"
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="px-8 py-1 border rounded hover:bg-white hover:text-primary"
          >
            verify
          </button>
        </div>
      </form>
      <Toaster />
    </section>
  );
};

export default OTPVerification;
