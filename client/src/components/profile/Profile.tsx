import React, { useEffect } from "react";
import Footer from "../layout/Footer";
import UpdateForm from "./UpdateForm";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { ProfileValues, getProfile } from "redux/userSlice";
import { verifyStatus } from "common/utils";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const profile = useAppSelector(
    (state) => state.users.profile
  ) as ProfileValues;

  const getProfileDetails = async () => {
    const response: any = await dispatch(getProfile());

    if (response.type === "/fetch-profile/rejected") {
      verifyStatus(response.payload.status, navigate);
    }
  };

  useEffect(() => {
    getProfileDetails();
  }, []);

  return (
    <div className="flex flex-col italic font-bold  w-full h-full">
      <div className="h-full">
        {profile !== null && (
          <div className="flex items-center justify-between px-8 py-2 bg-lightBlack text-white">
            <h1 className=" ">Hi {`${profile?.name}`}</h1>
            <span>{profile.role.toUpperCase()}</span>
          </div>
        )}

        <div className="my-8">
          <UpdateForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
