import {
  verifyStatus,
  types,
  status,
  priority,
  stampToInputDate,
} from "common/utils";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import {
  TaskValues,
  User,
  getProjects,
  Project,
  getUsers,
  addTask,
  getTask,
  taskFormMode,
  updateTask,
} from "redux/taskSlice";

interface Validation {
  title: string;
  project: string;
  dueDate: string;
  type: string;
  priority: string;
  progressStatus: string;
  members: Array<User> | [];
}

interface Values {
  title: string;
  project: string;
  dueDate: string;
  type: string;
  priority: string;
  progressStatus: string;
  members: Array<User> | [];
}

interface UpdateValues {
  dueDate: String;
  createdAt: Number;
  createdBy: { name: String; id: String };
  priority: String;
  progressStatus: String;
  project: String;
  status: String;
  title: String;
  type: String;
  updatedAt: Number;
  __v: Number;
  _id: String;
}

interface Errors {
  title?: string;
  project?: string;
  dueDate?: string;
  type?: string;
  priority?: string;
  members?: string;
  progressStatus?: string;
}

const error = {
  // title: "",
  // project: "",
  // dueDate: "",
  // type: "",
  // priority: "",
  // members: "",
  // progressStatus: "",
};

const TaskForm: React.FC = () => {
  const [members, setMembers] = useState<[]>([]);
  const [formValues, setFormValues] = useState<Values>({
    title: "",
    project: "",
    dueDate: "",
    type: "",
    priority: "",
    progressStatus: "",
    members: members,
  });
  const [errors, setErrors] = useState<Errors>(error);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const id = useParams().id;

  const users = useAppSelector((state) => state.tasks.users) as Array<User>;
  const mode = useAppSelector((state) => state.tasks.mode) as string;
  const projects = useAppSelector((state) => state.tasks.projects) as
    | Array<Project>
    | [];

  const getMyProjects = async () => {
    const resp = await dispatch(getProjects());
    if (resp.type !== "/fetch-projects/fulfilled") {
      verifyStatus(resp.payload.status, navigate);
      return;
    }
    return;
  };

  const getRoleUsers = async () => {
    const resp = await dispatch(getUsers());
    if (resp.payload === undefined) {
      verifyStatus(401, navigate);
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value, members });
    return;
  };

  const handleSelectedChanges = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value, members });
    return;
  };

  const getTaskDetails = async (id: String) => {
    const response: any = await dispatch(getTask(id));
    if (response.type === "/get-task/rejected") {
      verifyStatus(response.payload.status, navigate);
      return;
    }

    if (response.payload.data.data) {
      const filter = response.payload.data.data.assignTo.map((user: any) => ({
        label: user.label,
        value: user.value,
      }));
      setMembers(filter);

      const { dueDate, priority, progressStatus, project, title, type } =
        response.payload.data.data;

      setFormValues({
        priority,
        progressStatus,
        project,
        title,
        type,
        dueDate: stampToInputDate(dueDate),
        members: members,
      });
    }
  };

  useEffect(() => {
    getMyProjects();
    getRoleUsers();

    if (id) {
      getTaskDetails(id);
      dispatch(taskFormMode("update"));
      return;
    }
    dispatch(taskFormMode("create"));
  }, []);

  const validate = (values: Validation) => {
    const { title, project, dueDate, type, priority, members, progressStatus } =
      values;

    let errors: Errors = {};

    if (!title || title.trim() === "") {
      errors.title = "Required!";
    } else if (title.trim().length < 10) {
      errors.title = "Title must be of 10 Chars";
    }

    if (!priority || priority.trim() === "") {
      errors.priority = "Please select priority!";
    }

    if (!type || type.trim() === "") {
      errors.type = "Please select type!";
    }

    if (!project) {
      errors.project = "Please select project!";
    }

    if (
      new Date(dueDate ?? new Date(new Date().getTime() - 86400000)).getTime() <
      new Date().getTime()
    ) {
      errors.dueDate = "please choose upcoming date!";
    }

    if (!progressStatus || progressStatus.trim() === "") {
      errors.progressStatus = "Please choose status!";
    }

    if (members && members.length === 0) {
      errors.members = "Please assign to users!";
    }
    return errors;
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(error);

    const validationResults = validate({ ...formValues, members });
    if (Object.keys(validationResults).length > 0) {
      setErrors(validationResults);
      return;
    }

    if (mode === "create") {
      const resp: any = await dispatch(addTask(formValues));
      if (resp.type !== "/task-create/fulfilled") {
        verifyStatus(resp.payload.status, navigate);
        return;
      }
      toast.success("Task created", { position: "top-right" });
      setTimeout(() => navigate("/"), 1000);
    }

    if (mode === "update") {
      const resp: any = await dispatch(
        updateTask({ ...formValues, members, id: id })
      );
      if (resp.type !== "/update-task/fulfilled") {
        verifyStatus(resp.payload.status, navigate);
        return;
      }

      toast.success("Task Updated", { position: "top-right" });
      setTimeout(() => navigate("/"), 1000);
    }
  };

  return (
    <div className="h-full w-full mb-8">
      <div className="p-8">
        <h1 className="text-start px-8 font-bold text-lg text-gray-500 italic">
          {`${mode.toUpperCase()} TASK`}
        </h1>
      </div>
      <div className="flex flex-col w-[50%] mx-auto my-8  p-8 bg-white rounded-lg shadow ">
        <form className="flex gap-4 flex-col mb-8" onSubmit={submitHandler}>
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              className="rounded border p-1 w-full outline-none text-black"
              onChange={handleChange}
              value={formValues?.title}
            />
            {errors?.title ? (
              <p className="text-red-500 text-[13px]">{errors?.title}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="assignTo">Assign To</label>
            <MultiSelect
              options={users}
              value={members}
              onChange={setMembers}
              labelledBy="Choose Members"
            />
            {errors?.members ? (
              <p className="text-red-500 text-[13px]">{errors?.members}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="project">Project</label>
            <select
              className="rounded border p-1 w-full outline-none text-black"
              name="project"
              value={formValues?.project || ""}
              onChange={handleSelectedChanges}
            >
              <option value="" disabled>
                choose
              </option>
              {projects.map((project: Project, index) => (
                <option key={index} value={project?.id.toString()}>
                  {project?.name}
                </option>
              ))}
            </select>
            {errors?.project ? (
              <p className="text-red-500 text-[13px]">{errors?.project}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="type">Type</label>
            <select
              className="rounded border p-1 w-full outline-none text-black"
              name="type"
              value={formValues?.type || ""}
              onChange={handleSelectedChanges}
            >
              <option value="" disabled>
                {formValues.type
                  ? formValues.type.toUpperCase()
                  : "Choose type"}
              </option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors?.type ? (
              <p className="text-red-500 text-[13px]">{errors?.type}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              className="rounded border p-1 w-full outline-none text-black"
              value={formValues?.dueDate || ""}
              onChange={handleChange}
            />
            {errors?.dueDate ? (
              <p className="text-red-500 text-[13px]">{errors?.dueDate}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="progressStatus">Progress Status</label>
            <select
              className="rounded border p-1 w-full outline-none text-black"
              name="progressStatus"
              value={formValues?.progressStatus}
              onChange={handleSelectedChanges}
            >
              <option value="" disabled>
                choose
              </option>
              {status.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors?.progressStatus ? (
              <p className="text-red-500 text-[13px]">
                {errors?.progressStatus}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="priority">Task Priority</label>
            <select
              className="rounded border p-1 w-full outline-none text-black"
              name="priority"
              value={formValues?.priority}
              onChange={handleSelectedChanges}
            >
              <option value="" disabled>
                choose
              </option>
              {priority.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors?.priority ? (
              <p className="text-red-500 text-[13px]">{errors?.priority}</p>
            ) : null}
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
      <Toaster />
    </div>
  );
};

export default TaskForm;
