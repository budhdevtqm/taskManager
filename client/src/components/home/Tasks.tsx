import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "redux/taskSlice";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { verifyStatus, makeTitlePerfect, Priority } from "common/utils";

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const tasks: any = useAppSelector((state) => state.tasks.tasks);

  const getMyTasks = async () => {
    const resp: any = await dispatch(getTasks());
    if (resp.type === "/fetch-tasks/rejected") {
      verifyStatus(resp.payload.status, navigate);
      return;
    }
  };

  useEffect(() => {
    getMyTasks();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center px-8 py-4 ">
        <h1 className="font-bold text-primary text-[24px]">Tasks</h1>
        {localStorage.getItem("role") !== "user" && (
          <button
            className="flex border border-primary items-center gap-3 hover:bg-primary px-4 py-1 hover:text-white rounded text-primary border:primary bg-white"
            type="button"
            onClick={() => navigate("/home/task/create")}
          >
            Add Task
          </button>
        )}
      </div>
      {/* <div className="flex py-4 px-8 items-center justify-between">
        <h4 className="font-bold text-gray-500 italic">Filter</h4>
        <form className="flex items-center justify-evenly gap-8">
          <div>
            <input
              className="text-black p-1 outline-primary"
              type="text"
              name="title"
              id="title"
              placeholder="search text"
            />
          </div>
          <div>
            <select
              className="text-black p-[7px] min-w-[150px] outline-primary"
              name="assignTo"
            >
              <option className="italic bg-gray-500" value="">
                Assign To
              </option>
              {users.map((user) => (
                <option key={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              name="priority"
              className="text-black p-[7px] min-w-[150px] outline-primary"
            >
              <option className="italic bg-gray-500" value="">
                Status
              </option>
              {priority.map((p, index) => (
                <option key={index}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-8">
            <button
              className="outline-white px-4 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary hover:border-primary"
              type="button"
            >
              Search
            </button>
            <button
              className="outline-white px-4 py-2 bg-primary text-white rounded hover:bg-white hover:text-primary hover:border-primary"
              type="button"
            >
              Reset
            </button>
          </div>
        </form>
      </div> */}
      <div className="flex flex-wrap gap-4 items-center w-[80%] my-8 mx-auto">
        {tasks.length === 0 && (
          <div className="w-full h-full flex items-center justify-center font-bold text-[34px]">
            No Task Found!
          </div>
        )}
        {tasks.length !== 0 &&
          tasks.map((task: any) => (
            <div
              key={task._id}
              className="w-[150px] bg-white p-4 rounded-lg cursor-pointer shadow-lg"
              onClick={() => navigate(`/home/task/${task._id}`)}
            >
              <p className="text-[12px] text-wrap mb-2 break-all h-[40px]">
                {makeTitlePerfect(task.title)}
              </p>
              <span className="flex justify-between items-center mb-2">
                <span className="text-[13px]">Priority</span>
                {Priority(task.priority)}
              </span>
              <span className="flex justify-center items-center my-2">
                <span className="bg-lightBlack text-white py-1 shadow-lg px-4 rounded-xl text-xs">
                  {task.type}
                </span>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Tasks;
