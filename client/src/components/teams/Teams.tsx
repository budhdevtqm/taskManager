import React, { useState } from "react";
import { getDate, getTime } from "common/utils";
import { TbUsersPlus } from "react-icons/tb";
import { BsInfoCircle, BsPencil, BsTrash } from "react-icons/bs";
import Team from "./Team";
import { useNavigate } from "react-router-dom";

const teamsData = [
  {
    id: "1",
    name: "MERN Stack",
    members: [
      { name: "raman", role: "Designer" },
      { name: "Me", role: "react and node" },
    ],
    createdBy: { name: "Me", role: "react and node" },
    createdAt: new Date().getTime(),
  },
  {
    id: "2",
    name: "MEAN Stack",
    members: [
      { name: "raman", role: "Designer" },
      { name: "Me", role: "react and node" },
    ],
    createdBy: { name: "Me", role: "react and node" },
    createdAt: new Date().getTime(),
  },
  {
    id: "3",
    name: "MEVN Stack",
    members: [
      { name: "raman", role: "Designer" },
      { name: "Me", role: "react and node" },
    ],
    createdBy: { name: "Me", role: "react and node" },
    createdAt: new Date().getTime(),
  },
];

// const getFirsts = (name: string) => {
//   const splitted = name.split(" ");
//   if (splitted.length === 1) {
//     return splitted[0][0].toUpperCase();
//   } else if (splitted.length === 2) {
//     let initials = splitted[0][0] + splitted[1][0];
//     return initials.toUpperCase();
//   } else {
//     let initials = `${splitted[0][0]} ${splitted.at(-1)[0]}`;
//   }
// };

const Teams = () => {
  const [open, setOpen] = useState(false);
  const [teamId, setTeamId] = useState("");
  const navigate = useNavigate();

  const handleOpen = (id: string) => {
    setOpen(!open);
    if (id) {
      setTeamId(id);
      return;
    }
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleDelete = (id: string) => {
    console.log(id);
  };

  return (
    <React.Fragment>
      {open && <Team open={open} setOpen={handleClose} teamId={teamId} />}
      {!open && (
        <div>
          <div className="flex justify-between items-center px-8 py-4">
            <h1>Teams</h1>
            <button
              className="flex items-center gap-3 hover:bg-primary px-4 py-1 hover:text-white rounded text-primary border:primary bg-white"
              type="button"
              onClick={() => navigate("/teams/create")}
            >
              <TbUsersPlus />
              ADD
            </button>
          </div>
          <div>
            <div className=" w-[80%] my-4 mx-auto shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Team Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                  </tr>
                </thead>
                <tbody>
                  {teamsData.map((team) => (
                    <tr key={team.id}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex">
                          <div className="flex-shrink-0 w-10 h-10">
                            <img
                              className="w-full h-full rounded-full"
                              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                              alt=""
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-gray-900 whitespace-no-wrap">
                              {team.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {team.createdBy.name}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {getDate(team.createdAt)}
                        </p>
                        <p className="text-gray-600 whitespace-no-wrap">
                          {getTime(team.createdAt)}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {team.members.length}
                        </p>
                      </td>
                      <td className="px-5 py-8 border-b border-gray-200 bg-white text-sm text-right flex gap-2  cursor-pointer text-lg">
                        <BsInfoCircle
                          title="Info"
                          onClick={() => handleOpen(team.id)}
                        />
                        <BsPencil
                          title="Edit"
                          onClick={() => navigate(`/teams/update/${team.id}`)}
                        />
                        <BsTrash
                          title="Delete"
                          onClick={() => handleDelete(team.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Teams;
