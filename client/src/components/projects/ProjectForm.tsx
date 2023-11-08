import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import {
  addProject,
  getProjectById,
  projectFormMode,
  updateProject,
  Project,
} from "../../redux/projectSlice";
import { stampToInputDate } from "common/utils";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useFetch from "hooks/useFetch";
import usePost from "hooks/usePost";
import usePatch from "hooks/usePatch";
import Footer from "components/layout/Footer";

export interface ProjectValues {
  name?: string;
  description?: string;
  dueDate?: string;
}

const ProjectForm: React.FC = () => {
  const { fetchById } = useFetch();
  const { create } = usePost();
  const { update } = usePatch();
  const [formValues, setFormValues] = useState<ProjectValues>({
    name: "",
    description: "",
    dueDate: "",
  });

  const [errors, setErrors] = useState<any>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const projectId = useParams().id as string;

  const project = useAppSelector((state) => state.projects.project) as Project;
  const mode = useAppSelector((state) => state.projects.mode) as String;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values: ProjectValues) => {
    let errors: any = {};
    const { name, description, dueDate } = values;
    if (!name || name.trim() === "") {
      errors.name = "Please eneter name!";
    } else if (name.length < 3) {
      errors.name = "Name must be of 3 characters!";
    }
    if (!description || description.trim() === "") {
      errors.description = "Please eneter description!";
    } else if (description.length < 20) {
      errors.description = "Description must be at least of 20 characters!";
    }
    if (!dueDate || dueDate.trim() === "") {
      errors.dueDate = "Please select date";
    }
    return errors;
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const validationResults = validate(formValues);
    if (Object.keys(validationResults).length > 0) {
      setErrors(validationResults);
      return;
    }

    if (mode === "create") {
      await create(addProject, formValues);
      navigate("/projects");
    }

    if (mode === "update") {
      await update(updateProject, {
        ...formValues,
        projectId,
      });
      navigate("/projects");
    }
  };

  useEffect(() => {
    if (projectId) {
      dispatch(projectFormMode("update"));
      fetchById(getProjectById, projectId);
    }
  }, []);

  useEffect(() => {
    if (project !== null && projectId && "name" in project) {
      const { name, dueDate, description } = project;
      const dateString = stampToInputDate(dueDate);
      setFormValues({
        name,
        description,
        dueDate: dateString,
      });
    }
  }, [project]);

  return (
    <>
      <div className="h-full w-full">
        <div className="py-8">
          <h1 className="text-start px-8 font-bold text-lg text-gray-500">
            {`${mode.toUpperCase()} PROJECT`}
          </h1>
        </div>
        <div className="flex flex-col w-[50%] mx-auto mt-8  h-fit p-8 bg-white rounded-lg shadow">
          <form className="h-fit flex gap-2 flex-col" onSubmit={submitHandler}>
            <div className="flex flex-col gap-2">
              <label className="text-gray-500 font-semibold" htmlFor="name">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="rounded border p-1 w-full outline-none text-black"
                value={formValues.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-xs text-wrap">{errors.name}</p>
              )}
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
                value={formValues.dueDate}
                onChange={handleChange}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs text-wrap">
                  {errors.dueDate}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-gray-500 font-semibold"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                className="rounded border p-2 w-full outline-none text-black"
                value={formValues.description}
                onChange={handleDescriptionChange}
                rows={2}
              />
              {errors.description && (
                <p className="text-red-500 text-xs text-wrap">
                  {errors.description}
                </p>
              )}
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
      <Footer />
    </>
  );
};

export default ProjectForm;
