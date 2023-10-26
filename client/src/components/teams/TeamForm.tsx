import React, { useState } from "react";
import { MultiSelect } from "react-multi-select-component";

const TeamForm = () => {
  const [members, setMembers] = useState([]);
  const [formValues, setFormValues] = useState();

  const users = [
    { label: "Aman", value: 1 },
    { label: "Rman", value: 2 },
    { label: "Rohit", value: 3 },
    { label: "Me", value: 4 },
  ];

  return (
    <div className="h-full w-full">
      <div className="pb-[10%] pt-8">
        <h1 className="text-start px-8 font-bold text-lg text-gray-500 italic">
          Team Form
        </h1>
      </div>
      <div className="flex flex-col w-[50%] mx-auto my-8 h-fit p-8 bg-white rounded-lg shadow">
        <form className="h-fit">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Team Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="rounded border p-1 w-full outline-none text-black"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="members">Select Members</label>
            <MultiSelect
              options={users}
              value={members}
              onChange={setMembers}
              labelledBy="Choose Members"
            />
          </div>
          <div className="mt-4 flex items-center justify-center">
            <button
              type="submit"
              className="px-4 py-2 border bg-primary text-white border-primary rounded hover:bg-white hover:text-primary"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
