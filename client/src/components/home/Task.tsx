import React, { useEffect, useState } from "react";
import { getDate, verifyStatus } from "common/utils";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { deleteTask, getTask, TaskValues, updateStatus } from "redux/taskSlice";
import { Toaster, toast } from "react-hot-toast";
import Footer from "components/layout/Footer";
import { BsPencil, BsTrash } from "react-icons/bs";

interface ErrorValues {
  progressStatus?: String;
}

const progressStatus = (status: string) => {
  if (status === "pending") {
    return (
      <span className="text-[14px] py-1 text-white rounded-xl px-4 bg-gray-500">
        Pending
      </span>
    );
  } else if (status === "in progress") {
    return (
      <span className="text-[14px] py-1 text-white rounded-xl px-4 bg-orange-700">
        In Progress
      </span>
    );
  } else if (status === "done") {
    return (
      <span className="text-[14px] py-1 text-white rounded-xl px-4 bg-green-500">
        Done
      </span>
    );
  } else {
    return (
      <span className="text-[14px] py-1 text-white rounded-xl px-4 bg-lightBlack">
        N/A
      </span>
    );
  }
};

const isOperational = () => {
  const role = localStorage.getItem("role");
  if (role) {
    return role !== "user" && true;
  }
  return false;
};

const validate = (values: { progressStatus: String }) => {
  const errors: ErrorValues = {};
  const { progressStatus } = values;
  if (!progressStatus || progressStatus.trim() === "") {
    errors.progressStatus = "Required!";
  }
  return errors;
};

const Task: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const taskId = useParams().id as String;
  const [formValues, setFormValues] = useState({ progressStatus: "" });
  const [errors, setErrors] = useState<ErrorValues>({});

  const task = useAppSelector((state) => state.tasks.task) as TaskValues;

  const getTaskDetails = async (id: String) => {
    const response: any = await dispatch(getTask(id));
    if (response.type === "/get-task/rejected") {
      verifyStatus(response.payload.status, navigate);
      return;
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const updateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    const validationResults = validate(formValues);
    if (Object.keys(validationResults).length > 0) {
      setErrors(validationResults);
      return;
    }

    const response: any = await dispatch(
      updateStatus({ id: taskId, ...formValues })
    );

    if (response.type === "/update-status/fulfilled") {
      toast.success(response.payload.data.message, { position: "top-right" });
      getTask(taskId);
      return;
    }
  };

  const deleteHandler = async (id: String) => {
    const response: any = await dispatch(deleteTask(id));
    if (response.type === "/delete-task/fulfilled") {
      toast.success("Deleted.", { position: "top-right" });
      setTimeout(() => navigate("/"), 1000);
      return;
    }
    verifyStatus(response.payload.status, navigate);
  };

  const userNames =
    task &&
    task.assignTo.map((user: { label: String; values: String }) => user.label);

  useEffect(() => {
    if (taskId) {
      getTaskDetails(taskId);
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
          <div className="grid">
            <div className=""></div>
            <div></div>
          </div>
          {/* <div className="px-8 py-4">
            <div className="bg-white py-2 px-8">
              <h6 className="text-center my-2 underline">Discription</h6>
              <p
                className="text-wrap text-[15px] font-light text-center break-all rounded bg-secondary p-2 "
                title="Task Info"
              >
                {task.title}
              </p>
            </div>
            <div className="flex items-center justify-center my-4 gap-8">
              <div className="flex items-center flex-col bg-white w-[200px] p-3 hover:rounded-xl justify-center gap-4 hover:shadow-xl">
                <span className="text-gray-500   ">Status</span>
                {progressStatus(task?.progressStatus)}
              </div>
              <div className="flex items-center flex-col bg-white w-[200px] p-3 hover:rounded-xl justify-center gap-4 hover:shadow-xl">
                <span className="text-gray-500">AssignTo</span>
                <span className="flex flex-wrap gap-3">
                  {userNames.map((name, index) => (
                    <span
                      key={index}
                      className="text-[14px] py-1 text-white rounded-xl px-4 bg-lightBlack"
                    >
                      {name}
                    </span>
                  ))}
                </span>
              </div>

              <div className="flex items-center flex-col bg-white w-[200px] p-3  justify-center gap-4 hover:rounded-xl hover:shadow-xl">
                <span className="text-gray-500">Task Of</span>
                <span className="text-[14px] py-1 text-white rounded-xl px-4 bg-lightBlack">
                  {task.type}
                </span>
              </div>
            </div>
          </div> */}
          {/* {isOperational() && (
            <div className="flex items-center gap-4 justify-end px-8">
              <BsPencil
                onClick={() => navigate(`/home/task/update/${taskId}`)}
                className=" cursor-pointer"
              />
              <BsTrash
                onClick={() => deleteHandler(taskId)}
                className=" cursor-pointer"
              />
            </div>
          )} */}

          <Toaster />
        </div>
      )}
      <Footer />
    </>
  );
};

export default Task;

/* {localStorage.getItem("role") === "user" && ( */

/* <div className="flex items-center justify-center my-8">
            <form
              className="p-8 bg-white rounded shadow-xl w-[40%]"
              onSubmit={updateHandler}
            >
              <div className="flex flex-col">
                <label
                  className="mb-3  font-bold text-gray-500"
                  htmlFor="progressStatus"
                >
                  Update Status
                </label>
                <select
                  name="progressStatus"
                  id="progressStatus"
                  className="border-2 rounded p-1"
                  onChange={changeHandler}
                  value={formValues.progressStatus}
                >
                  <option
                    className="italic"
                    disabled
                    value={task.progressStatus}
                  >
                    {task.progressStatus.toUpperCase()}
                  </option>
                  {status.map((s, index) => (
                    <option key={index} value={s}>
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
                {errors.progressStatus && (
                  <p className="text-red-500 text-[13px]">
                    {errors.progressStatus}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-center mt-4">
                <button
                  className="rounded-lg px-4 py-2 bg-green-700 text-green-100 hover:bg-green-800 duration-300"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </form>
          </div> */

/* )} */
