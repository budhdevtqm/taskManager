import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "redux/taskSlice";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { verifyStatus, makeTitlePerfect, priorityClass } from "common/utils";
import Footer from "components/layout/Footer";
import Filter from "./Filter";
import { useLocation } from "react-router-dom";

export interface FilterTypes {
  text?: string;
  type?: string;
}

interface CreatedBy {
  name: string;
  id: string;
}

interface AssignUser {
  label: string;
  value: string;
  _id: string;
}

interface Task {
  createdBy: CreatedBy;
  _id: string;
  title: string;
  project: string;
  assignTo: Array<AssignUser>;
  dueDate: number;
  type: string;
  progressStatus: string;
  priority: string;
  createdAt: number;
  updatedAt: number;
  status: boolean;
  __v: number;
}

const Tasks: React.FC = () => {
  const [filter, setFilter] = useState<FilterTypes>({ text: "", type: "" });
  const [filtered, setFiltered] = useState<Task[] | []>([]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const tasks: any = useAppSelector((state) => state.tasks.tasks);

  const getMyTasks = async () => {
    const resp: any = await dispatch(getTasks());
    if (resp.type === "/fetch-tasks/rejected") {
      verifyStatus(resp.payload.status, navigate);
      return;
    }

    setFiltered(resp.payload.data.data);
  };

  const filterHandler = (values: FilterTypes, tasks: Task[]) => {
    const { text, type } = values;

    if (text?.trim() === "" && type === "") {
      setFiltered(tasks);
      return;
    }

    if (text?.trim() !== "" && type?.trim() !== "") {
      const byText = tasks.filter((task: any) =>
        task.title.toLowerCase().includes(text?.trim().toLowerCase())
      );

      const result = byText.filter((task: any) => task.type === type);
      setFiltered(result);
      return;
    }

    if (text?.trim() !== "" && type === "") {
      const result =
        tasks &&
        tasks.filter((task: any) =>
          task.title.toLowerCase().includes(text?.trim().toLowerCase())
        );
      setFiltered(result);
      return;
    }

    if (type !== "" && text?.trim() === "") {
      const result = tasks && tasks.filter((task: any) => task.type === type);
      setFiltered(result);
      return;
    }
  };

  useEffect(() => {
    getMyTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      filterHandler(filter, tasks);
    }
  }, [filter.text, filter.type]);

  return (
    <>
      <div className="min-h-full">
        <div className="flex justify-between items-center px-8 py-4">
          <h1 className="font-bold text-primary text-[24px]">Tasks</h1>

          <Filter filter={filter} set={setFilter} />

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

        {filtered.length === 0 && (
          <div className="w-full h-[100%] flex items-center justify-center">
            <h1 className="font-bold text-[34px] my-8"> No Task Found!</h1>
          </div>
        )}
        <div className="grid grid-cols-3 gap-4 w-[90%] my-8 mx-auto">
          {filtered.length !== 0 &&
            filtered.map((task: any) => (
              <div
                key={task._id}
                className={`flex flex-col bg-white rounded-lg shadow-lg  ${priorityClass(
                  task.priority,
                  "border"
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
