import React from "react";
import { Modal } from "react-responsive-modal";
import { SigleUser } from "./Users";
import { getDate } from "common/utils";

interface ModleProps {
  open: Boolean;
  setOpen: () => void;
  userData: SigleUser | null;
}

const ViewUser: React.FC<ModleProps> = ({ open, setOpen, userData }) => {
  return (
    <Modal center open onClose={setOpen}>
      <div className="min-w-[500px] h-full">
        <div className="mb-8 flex">
          <h1 className="font-bold bg-primary px-4 text-white py-1 rounded-full">
            {userData?.name}
          </h1>
        </div>
        <div>
          <div className="flex my-1">
            <span className="w-[50%] text-gray-500">Email</span>
            <span className="w-[50%]">{userData?.email}</span>
          </div>
          <div className="flex my-1">
            <span className="w-[50%] text-gray-500">Verified</span>
            <span className="w-[50%]">
              {userData?.isVerified ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex my-1">
            <span className="w-[50%] text-gray-500">Registration Date</span>
            <span className="w-[50%]">{getDate(userData?.createdAt)}</span>
          </div>

          <div className="flex my-1">
            <span className="w-[50%] text-gray-500">Last Updated</span>
            <span className="w-[50%]">
              {userData?.updatedAt ? getDate(userData?.updatedAt) : "N/A"}
            </span>
          </div>

          <div className="flex my-1">
            <span className="w-[50%] text-gray-500">Role</span>
            <span className="w-[50%] flex">
              <p className="text-[14px] text-center font-bold">
                {userData?.role?.toUpperCase()}
              </p>
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewUser;
