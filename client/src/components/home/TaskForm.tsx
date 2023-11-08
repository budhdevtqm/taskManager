import React, { useEffect, useState } from "react";
import { types, status, priority, stampToInputDate } from "common/utils";
import Footer from "components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { MultiSelect } from "react-multi-select-component";
import { useNavigate, useParams } from "react-router-dom";
import { AiFillFile } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { makeFileNameClean } from "common/utils";
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
import UploadedFiles from "./UploadedFiles";
import useFetch from "hooks/useFetch";
import usePost from "hooks/usePost";
import usePatch from "hooks/usePatch";

interface File {
  lastModified: number;
  lastModifiedDate: string;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

interface Validation {
  title: string;
  project: string;
  dueDate: string;
  type: string;
  priority: string;
  progressStatus: string;
  members: Array<User> | [];
  taskPay: string;
}

interface Values {
  title: string;
  project: string;
  dueDate: string;
  type: string;
  priority: string;
  progressStatus: string;
  members: Array<User> | [];
  taskPay: string;
}

interface Errors {
  title?: string;
  project?: string;
  dueDate?: string;
  type?: string;
  priority?: string;
  members?: string;
  progressStatus?: string;
  taskPay?: string;
}

const error = {};

const TaskForm: React.FC = () => {
  const { handleFetch, fetchById } = useFetch();
  const { create } = usePost();
  const { update } = usePatch();
  const [files, setFiles] = useState<Array<File> | []>([]);
  const [members, setMembers] = useState<[]>([]);
  const [formValues, setFormValues] = useState<Values>({
    title: "",
    project: "",
    dueDate: "",
    type: "",
    priority: "",
    progressStatus: "",
    members: members,
    taskPay: "",
  });
  const [errors, setErrors] = useState<Errors>(error);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const id = useParams().id;

  const users = useAppSelector((state) => state.tasks.users) as Array<User>;
  const mode = useAppSelector((state) => state.tasks.mode) as string;
  const task = useAppSelector((state) => state.tasks.task) as TaskValues;
  const projects = useAppSelector((state) => state.tasks.projects) as
    | Array<Project>
    | [];

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

  useEffect(() => {
    handleFetch(getProjects);
    handleFetch(getUsers);

    if (id) {
      fetchById(getTask, id);
      dispatch(taskFormMode("update"));
      return;
    }
    dispatch(taskFormMode("create"));
  }, []);

  useEffect(() => {
    if (id && task !== null && "dueDate" in task) {
      const {
        assignTo,
        dueDate,
        priority,
        progressStatus,
        project,
        title,
        type,
        taskPay,
      } = task;

      const filter = assignTo.map((user: any) => ({
        label: user.label,
        value: user.value,
      })) as [];

      setMembers(filter);
      setFormValues({
        priority,
        progressStatus,
        project,
        title,
        type,
        dueDate: stampToInputDate(dueDate),
        members: members,
        taskPay: taskPay ?? "0",
      });
    }
  }, [task]);

  const validate = (values: Validation) => {
    const {
      title,
      project,
      dueDate,
      type,
      priority,
      members,
      progressStatus,
      taskPay,
    } = values;

    let errors: Errors = {};

    if (!title || title.trim() === "") {
      errors.title = "Please add title to your task!";
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

    if (dueDate.trim() === "" || dueDate === "") {
      errors.dueDate = "please choose date!";
    }

    if (
      (!progressStatus && mode === "update") ||
      (progressStatus.trim() === "" && mode === "update")
    ) {
      errors.progressStatus = "Please choose status!";
    }

    if (members && members.length === 0) {
      errors.members = "Please assign to users!";
    }

    if (Number(taskPay) <= 0 || Number(taskPay) === 0) {
      errors.taskPay = "Please enter a valid amount!";
    }

    return errors;
  };

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    const updatedValues = Object.assign([], selectedFiles);
    setFiles(updatedValues);
  };

  const removeFileHandler = (index: number) => {
    const filter = files.filter((file: File, idx: number) => idx !== index);
    setFiles(filter);
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
      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file as any);
      }

      formData.append("dueDate", formValues["dueDate"]);
      formData.append("project", formValues["project"]);
      formData.append("title", formValues["title"]);
      formData.append("type", formValues["type"]);
      formData.append("taskPay", formValues["taskPay"]);
      formData.append("members", JSON.stringify(formValues["members"]));

      await create(addTask, formData);
      navigate("/");
    }

    if (mode === "update") {
      const formData = new FormData();

      for (const file of files) {
        formData.append("files", file as any);
      }

      formData.append("dueDate", formValues["dueDate"]);
      formData.append("project", formValues["project"]);
      formData.append("title", formValues["title"]);
      formData.append("type", formValues["type"]);
      formData.append("taskPay", formValues["taskPay"]);
      formData.append("progressStatus", formValues["progressStatus"]);
      formData.append("members", JSON.stringify(formValues["members"]));

      await update(updateTask, { values: formData, id });
      navigate(`/home/task/${id}`);
    }
  };

  return (
    <>
      <div className="min-h-full w-full mb-8">
        <div className="p-8">
          <h1 className="text-start px-8 font-bold text-lg text-gray-500 italic">
            {`${mode.toUpperCase()} TASK`}
          </h1>
        </div>
        <div className="flex flex-col w-[50%] mx-auto my-8  p-8 bg-white rounded-lg shadow ">
          <form
            className="flex gap-4 flex-col mb-8"
            encType="multipart/form-data"
            onSubmit={submitHandler}
          >
            <div className="flex flex-col gap-2">
              <label className="text-gray-500 font-semibold" htmlFor="title">
                Title
              </label>
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
              <label className="text-gray-500 font-semibold" htmlFor="assignTo">
                Assign To
              </label>
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
              <label className="text-gray-500 font-semibold" htmlFor="project">
                Project
              </label>
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
              <label className="text-gray-500 font-semibold" htmlFor="type">
                Type
              </label>
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
              <label className="text-gray-500 font-semibold" htmlFor="dueDate">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                min={new Date().toISOString().split("T")[0]}
                className="rounded border p-1 w-full outline-none text-black"
                value={formValues?.dueDate || ""}
                onChange={handleChange}
              />
              {errors?.dueDate ? (
                <p className="text-red-500 text-[13px]">{errors?.dueDate}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-gray-500 font-semibold"
                htmlFor="progressStatus"
              >
                Task Pay ($)
              </label>
              <input
                type="number"
                className="rounded border p-1 w-full outline-none text-black"
                name="taskPay"
                value={formValues?.taskPay}
                onChange={handleChange}
              />
              {errors?.taskPay ? (
                <p className="text-red-500 text-[13px]">{errors?.taskPay}</p>
              ) : null}
            </div>

            {mode === "update" && (
              <div className="flex flex-col gap-2">
                <label
                  className="text-gray-500 font-semibold"
                  htmlFor="progressStatus"
                >
                  Progress Status
                </label>
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
            )}
            <div>
              <label className="text-gray-500 font-semibold" htmlFor="priority">
                Task Priority
              </label>
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

            <div className="flex flex-col items-center center p-3 gap-4">
              <label className=" flex flex-col items-center justify-center px-4 py-3  bg-white text-primary rounded-lg shadow-lg tracking-wide  border border-blue cursor-pointer hover:bg-teal-500 hover:text-white">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-base leading-normal">
                  Upload Files
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf, .doc, .docx, .xls, .txt"
                  name="image"
                  onChange={fileChangeHandler}
                  multiple
                />
              </label>
              <div className="w-full flex items-center justify-center gap-2">
                {files.map((file: File, index) => (
                  <span
                    className="w-[70px] h-[70px] flex flex-col items-center justify-center border rounded hover:shadow-xl"
                    title={file.name}
                  >
                    <div className="w-full flex items-center justify-end text-red-500 px-1">
                      <RxCross2
                        className="cursor-pointer"
                        title="Remove"
                        onClick={() => removeFileHandler(index)}
                      />
                    </div>
                    <AiFillFile className="w-[60px] h-[60px] text-primary" />
                    <p className="text-[10px] text-center">
                      {makeFileNameClean(file.name)}
                    </p>
                  </span>
                ))}
              </div>
            </div>

            {mode === "update" && <UploadedFiles taskId={id as string} />}

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
      <Footer />
    </>
  );
};

export default TaskForm;
