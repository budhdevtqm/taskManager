import React, { useEffect } from "react";
import Footer from "../layout/Footer";
import UpdateForm from "./UpdateForm";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { ProfileValues, getProfile } from "redux/userSlice";
import { verifyStatus } from "common/utils";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
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
    <>
      <div className="min-h-full flex-col  font-bold  w-full ">
        <div className="h-full">
          {profile !== null && (
            <div className="flex items-center justify-between  px-8 py-4">
              <h1 className="font-bold text-primary text-[24px]">Profile</h1>
              <span className="text-primary font-semiBold">
                {profile.role.toUpperCase()}
              </span>
            </div>
          )}

          <div className="my-8">
            <UpdateForm />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
