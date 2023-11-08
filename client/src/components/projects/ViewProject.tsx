import React from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { getDate, getTime } from "common/utils";
import { Project } from "redux/projectSlice";

interface PropsType {
  open: boolean;
  setOpen: () => void;
  project: Project;
}

const ViewProject: React.FC<PropsType> = ({ open, setOpen, project }) => {
  return (
    <Modal center open={open} onClose={setOpen}>
      <div className="w-[500px]">
        <h1 className="text-gray-500 font-bold text-center">{project.name}</h1>
        <div className="my-4">
          <div className="flex my-1 p-1">
            <span className="text-gray-500 w-[40%]">Created By</span>
            <span className="w-[60%]">{project?.createdBy?.name}</span>
          </div>
          <div className="flex my-1 p-1">
            <span className="text-gray-500 w-[40%]">Created At</span>
            <span className="w-[60%]">{`  ${getTime(
              project.createdAt
            )} ${getDate(project.createdAt)}`}</span>
          </div>
          <div className="flex flex-col my-1 p-1">
            <h5 className="text-center font-bold my-2">Description</h5>
            <p className="text-center px-2">{project.description}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewProject;
