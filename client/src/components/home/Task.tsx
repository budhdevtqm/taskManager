import React, { useEffect, useState } from "react";
import {
  baseURL,
  getDate,
  headerConfig,
  priorityClass,
  verifyStatus,
} from "common/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { deleteTask, getTask, TaskValues } from "redux/taskSlice";
import { Toaster, toast } from "react-hot-toast";
import Footer from "components/layout/Footer";
import { BsPencil, BsTrash } from "react-icons/bs";
import TaskStatusForm from "./TaskStatusForm";
import axios from "axios";
import {
  BsFiletypePdf,
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypeXls,
  BsFiletypeTxt,
} from "react-icons/bs";

interface uploadedFile {
  createdAt: number;
  createdBy: string;
  filename: string;
  status: boolean;
  taskId: string;
  updatedAt: number;
  __v: number;
  _id: string;
}

const iconStyle = "text-[60px] text-primary";

const renderFileIcon = (filename: string) => {
  const ext = filename.split(".")[filename.split(".").length - 1];
  if (ext === "xls") {
    return <BsFiletypeXls className={iconStyle} />;
  }

  if (ext === "doc") {
    return <BsFiletypeDoc className={iconStyle} />;
  }

  if (ext === "docx") {
    return <BsFiletypeDocx className={iconStyle} />;
  }

  if (ext === "pdf") {
    return <BsFiletypePdf className={iconStyle} />;
  }

  if (ext === "txt") {
    return <BsFiletypeTxt className={iconStyle} />;
  }
};

const openTab = (filename: string) => {
  return baseURL + "/images/tasks/" + filename;
};

const Task: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<uploadedFile[] | []>([]);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userRole = localStorage.getItem("role");
  const taskId = useParams().id as string;

  const task = useAppSelector((state) => state.tasks.task) as TaskValues;

  const getTaskDetails = async (id: String) => {
    const response: any = await dispatch(getTask(id));
    if (response.type === "/get-task/rejected") {
      verifyStatus(response.payload.status, navigate);
      return;
    }
  };

  const deleteHandler = async (id: string) => {
    const response: any = await dispatch(deleteTask(id));
    if (response.type === "/delete-task/fulfilled") {
      toast.success("Deleted.", { position: "top-right" });
      setTimeout(() => navigate("/"), 1000);
      return;
    }
    verifyStatus(response.payload.status, navigate);
  };

  const fetchFiles = async (taskId: string) => {
    try {
      const response = await axios.get(
        baseURL + "/task/get-files/" + taskId,
        headerConfig
      );

      setUploadedFiles(response.data.data);
    } catch (error: any) {
      verifyStatus(error?.response?.status, navigate);
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetails(taskId);
      fetchFiles(taskId);
    }
  }, []);

  return (
    <>
      {task !== null && (
        <div className="min-h-full">
          <div className="flex px-8 py-4 items-center justify-between">
            <h1 className="font-bold text-primary text-[24px]">Task</h1>
            <span
              title="Due Date"
              className="text-[16px] text-primary p-1 rounded "
            >
              {getDate(task?.dueDate)}
            </span>
          </div>
          <div className="grid w-[90%] mx-auto">
            <div className="bg-white  p-8 rounded-xl shadow-xl mb-6">
              <p className="text-gray-800">{task.title}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-xl  mb-6">
              <div className="grid grid-cols-4 gap-2 ">
                <div
                  className="border-2 text-center p-3 rounded-xl"
                  title="Priority"
                >
                  <p
                    className={`${priorityClass(
                      task.priority,
                      "color"
                    )} font-semibold capitalize`}
                  >
                    {task.priority}
                  </p>
                </div>
                <div
                  className="border-2 text-center p-3 rounded-xl"
                  title="Progress"
                >
                  <p className="font-semibold capitalize">
                    {task.progressStatus}
                  </p>
                </div>
                <div
                  className="border-2 text-center p-3 rounded-xl"
                  title="Type"
                >
                  <p className="font-semibold capitalize text-primary">
                    {task.type}
                  </p>
                </div>
                <div
                  className="border-2 text-center p-3 rounded-xl"
                  title="Assigned By"
                >
                  <p className="font-semibold text-green-600">
                    {task.createdBy.name}
                  </p>
                </div>
              </div>
              <div className="grid gird-rows-2 my-4">
                <h5 className="text-gray-400 text-center font-bold ">
                  ASSIGNED TO
                </h5>
                <div className="grid grid-cols-3 gap-3 my-4">
                  {task.assignTo.map(
                    (user: { label: string; value: string }, index) => (
                      <p
                        key={index}
                        className="text-center p-2 bg-primary rounded text-white font-medium shadow-xl"
                      >
                        {user.label}
                      </p>
                    )
                  )}
                </div>
              </div>
              <div className="my-4">
                <h5 className="text-gray-400 text-center font-bold ">
                  DOCUMENTS
                </h5>
                {uploadedFiles.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {uploadedFiles.map((file: uploadedFile) => (
                      <div
                        title={file.filename}
                        key={file._id}
                        className="flex flex-col border-2 rounded-lg py-3 shadow-xl"
                        onClick={() =>
                          window.open(openTab(file.filename), "_blank")
                        }
                      >
                        <div className="flex items-center justify-end"></div>
                        <div className="flex items-center justify-center">
                          {renderFileIcon(file.filename)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center my-4 flex items-center justify-center">
                    <p className="font-bold  rounded-xl px-2  py-1 bg-yellow-500">
                      No Files!
                    </p>
                  </div>
                )}
              </div>

              {userRole && (
                <div>
                  {userRole === "admin" ||
                    (userRole === "superAdmin" && (
                      <div className="flex items-center justify-end">
                        <span className="px-4 py-2  flex gap-4 cursor-pointer">
                          <BsPencil
                            onClick={() =>
                              navigate(`/home/task/update/${taskId}`)
                            }
                            className=" cursor-pointer"
                            title="Edit"
                          />
                          <BsTrash
                            onClick={() => deleteHandler(taskId)}
                            className=" cursor-pointer"
                            title="Delete"
                          />
                        </span>
                      </div>
                    ))}

                  {userRole === "user" && <TaskStatusForm />}
                </div>
              )}
            </div>
          </div>
          <Toaster />
        </div>
      )}
      <Footer />
    </>
  );
};

export default Task;
