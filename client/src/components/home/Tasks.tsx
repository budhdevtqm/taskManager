import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "redux/taskSlice";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { verifyStatus, makeTitlePerfect, priorityClass } from "common/utils";
import Footer from "components/layout/Footer";

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
  console.log("tasks", tasks);

  useEffect(() => {
    getMyTasks();
  }, []);

  return (
    <>
      <div className="min-h-full">
        <div className="flex justify-between items-center px-8 py-4">
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
        {/*  */}
        <div className="grid grid-cols-3 gap-4 w-[90%] my-8 mx-auto">
          {tasks.length === 0 && (
            <div className="w-full h-full flex items-center justify-center font-bold text-[34px]">
              No Task Found!
            </div>
          )}
          {tasks.length !== 0 &&
            tasks.map((task: any) => (
              <div
                key={task._id}
                className={`flex flex-col bg-white rounded-lg shadow-lg  ${priorityClass(
                  task.priority
                )}`}
              >
                <div className="flex items-center mt-2">
                  <h3 className="font-bold text-primary px-4 rounded-xl text-m">
                    {task.type}
                  </h3>
                </div>
                <p
                  onClick={() => navigate(`/home/task/${task._id}`)}
                  className="text-[14px] text-wrap px-4 pb-4 pt-2 break-all min-h-[60px] cursor-pointer"
                >
                  {makeTitlePerfect(task.title)}
                </p>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Tasks;

/*


<div className="flex py-4 px-8 items-center justify-between">
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
      </div>


*/
