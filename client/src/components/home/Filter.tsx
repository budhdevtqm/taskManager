import React from "react";
import { types } from "common/utils";
import { FilterTypes } from "./Tasks";

interface FilterProps {
  filter: FilterTypes;
  set: (filterTypes: FilterTypes) => void;
}

const Filter: React.FC<FilterProps> = ({ filter, set }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    set({ ...filter, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    set({ ...filter, [name]: value });
  };

  return (
    <form className="flex items-center justify-evenly gap-4  py-1 px-8 rounded-xl">
      <div>
        <input
          type="text"
          name="text"
          id="title"
          placeholder="Search using text..."
          value={filter?.text || ""}
          className="text-black p-1 px-2 outline-none rounded-xl border border-lightBlack"
          onChange={handleInputChange}
        />
      </div>
      <div>
        <select
          name="type"
          className="text-black p-1 px-2  min-w-[150px] outline-none rounded border border-lightBlack"
          value={filter?.type || ""}
          onChange={handleSelectChange}
        >
          <option className="italic" value="">
            All Type
          </option>
          {types.map((type, index) => (
            <option key={index}>{type}</option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default Filter;
