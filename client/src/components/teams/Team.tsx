import React, { useState } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { getDate, getTime } from "common/utils";

const Team = ({
  open,
  setOpen,
  teamId,
}: {
  open: boolean;
  setOpen: () => void;
  teamId: string;
}) => {
  const [team] = useState({
    name: "MERN Stack",
    id: "1212",
    createdBy: { name: "Me" },
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
    members: [
      { name: "me", role: "developer", id: 1 },
      {
        name: "mandeep",
        role: "developer",
        id: 2,
      },
      {
        name: "mandeep",
        role: "designer",
        id: 3,
      },
    ],
  });
  return (
    <Modal open={open} onClose={setOpen} center>
      <div className="w-[500px]">
        <h1 className="text-center px-8 font-bold text-lg text-gray-500 italic">
          Team Information
        </h1>
        <div>
          <div className="my-4">
            <div className="flex my-1 p-1">
              <span className="text-gray-500 w-[40%]">Name</span>
              <span className="w-[60%]">{team.name}</span>
            </div>
            <div className="flex my-1 p-1">
              <span className="text-gray-500 w-[40%]">Created By</span>
              <span className="w-[60%]">{team.createdBy.name}</span>
            </div>
            <div className="flex my-1 p-1">
              <span className="text-gray-500 w-[40%]">Created At</span>
              <span className="w-[60%]">
                {`${getDate(team.createdAt)} <> ${getTime(team.createdAt)}`}
              </span>
            </div>
          </div>
          <div>
            <h4 className="bg-secondary  text-white p-2 rounded text-center">
              Members
            </h4>
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex rounded-lg items-center justify-evenly p-4 w-[100%] mx-auto bg-bgWhite my-1 border hover:shadow"
              >
                <span className="w-[50%] font-bold text-sm">{member.name}</span>
                <span className="w-[50%] text-gray-500">{member.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Team;
