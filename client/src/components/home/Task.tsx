import React, { useEffect } from "react";
import { baseURL, getDate, priorityClass } from "common/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "redux/hooks";
import {
  deleteTask,
  getTask,
  getTaskFiles,
  TaskValues,
  UploadedFile,
} from "redux/taskSlice";
import { Toaster } from "react-hot-toast";
import Footer from "components/layout/Footer";
import { BsPencil, BsTrash } from "react-icons/bs";
import TaskStatusForm from "./TaskStatusForm";
import {
  BsFiletypePdf,
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypeXls,
  BsFiletypeTxt,
} from "react-icons/bs";
import useFetch from "hooks/useFetch";
import useDelete from "hooks/useDelete";

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
  const navigate = useNavigate();
  const { fetchById } = useFetch();
  const handleDelete = useDelete();
  const userRole = localStorage.getItem("role");
  const taskId = useParams().id as string;

  const task = useAppSelector((state) => state.tasks.task) as TaskValues;
  const files = useAppSelector((state) => state.tasks.files) as
    | UploadedFile[]
    | [];

  const deleteHandler = async (id: string) => {
    await handleDelete(deleteTask, id);
    navigate("/");
  };

  useEffect(() => {
    if (taskId) {
      fetchById(getTask, taskId);
      fetchById(getTaskFiles, taskId);
    }
  }, []);

  return (
    <>
      {task !== null && (
        <div className="min-h-full">
          <div className="flex px-8 py-4 items-center justify-between">
            <h1 className="font-bold text-primary text-[24px]">Task</h1>
            {task.taskPay && (
              <h4 className="font-semibold">{`$ ${task.taskPay}`}</h4>
            )}
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
                {files.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {files.map((file: UploadedFile) => (
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
