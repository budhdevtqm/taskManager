import React, { useEffect } from "react";
import { verifyStatus } from "common/utils";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { getProfile, ProfileValues } from "redux/userSlice";

const LayoutHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const profile = useAppSelector(
    (state) => state.users.profile
  ) as null | ProfileValues;

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
      {profile !== null && (
        <div className="bg-layoutHeader py-[4px] text-primary flex items-center justify-center">
          <p className="flex items-center">
            Hii, {profile?.name}
          </p>
        </div>
      )}
    </>
  );
};

export default LayoutHeader;
