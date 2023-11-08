import React, { useEffect } from "react";
import { useAppSelector } from "redux/hooks";
import { getProfile, ProfileValues } from "redux/userSlice";
import useFetch from "hooks/useFetch";

const LayoutHeader: React.FC = () => {
  const { handleFetch } = useFetch();

  const profile = useAppSelector(
    (state) => state.users.profile
  ) as null | ProfileValues;

  useEffect(() => {
    handleFetch(getProfile);
  }, []);

  return (
    <>
      {profile !== null && (
        <div className="bg-layoutHeader py-[4px] text-primary flex items-center justify-center">
          <p className="flex items-center">Hii, {profile?.name}</p>
        </div>
      )}
    </>
  );
};

export default LayoutHeader;
