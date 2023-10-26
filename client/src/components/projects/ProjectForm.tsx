import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import {
  RoleUser,
  addProject,
  getUsers,
  SomeDetails,
  getProjectById,
  projectFormMode,
  updateProject,
} from "../../redux/projectSlice";
import { stampToInputDate, verifyStatus } from "common/utils";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { AxiosResponse } from "axios";

interface Member {
  label: string;
  value: string;
}

export interface ProjectValues {
  name?: string;
  members?: Array<Member>;
  description?: string;
  dueDate?: string;
}

const ProjectForm: React.FC = () => {
  const [formValues, setFormValues] = useState<ProjectValues>({
    name: "",
    members: [],
    description: "",
    dueDate: "",
  });
  const [members, setMembers] = useState<Array<RoleUser> | []>([]);
  const [errors, setErrors] = useState<any>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const projectId = useParams().id;

  const users = useAppSelector(
    (state) => state.projects.users
  ) as Array<RoleUser>;

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
    const { name, description, dueDate, members } = values;
    if (!name || name.trim() === "") {
      errors.name = "Required!";
    } else if (name.length < 3) {
      errors.name = "Name must be of 3 characters!";
    }
    if (!description || description.trim() === "") {
      errors.description = "Required!";
    } else if (description.length < 20) {
      errors.description = "Description must be at least of 20 characters!";
    }
    if (!dueDate || dueDate.trim() === "") {
      errors.dueDate = "Required!";
    } else if (new Date(dueDate).getTime() < new Date().getTime()) {
      errors.dueDate = "Please select upcoming date!";
    }
    if (members?.length === 0) {
      errors.members = "Please choose at least 1 member!";
    }
    return errors;
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const modifiedValues: SomeDetails | any = { ...formValues, members };
    const validationResults = validate(modifiedValues);
    if (Object.keys(validationResults).length > 0) {
      setErrors(validationResults);
      return;
    }

    if (mode === "create") {
      const response: AxiosResponse | any = await dispatch(
        addProject(modifiedValues)
      );
      if (response.type === "add/project/fulfilled") {
        toast.success("Project added successfully.", {
          position: "top-right",
        });
        setTimeout(() => navigate("/projects"), 1000);
        return;
      }

      verifyStatus(response?.payload?.status, navigate);
      return;
    }

    if (mode === "update") {
      const response: AxiosResponse | any = await dispatch(
        updateProject({ ...modifiedValues, projectId: projectId })
      );
      if (response.type === "update/project/fulfilled") {
        toast.success("Project Updated successfully.", {
          position: "top-right",
        });
        setTimeout(() => navigate("/projects"), 1000);
        return;
      }

      verifyStatus(response?.payload?.status, navigate);
      return;
    }
  };

  const getRoleUsers = async () => {
    const response: any = await dispatch(getUsers());
    if (response.type === "/get/users/rejected") {
      verifyStatus(response.payload.status, navigate);
      return;
    }
  };

  const getProject = async (id: String) => {
    const response = await dispatch(getProjectById(id));
    if (response.type !== "/project-by-id/fulfilled") {
      verifyStatus(response.payload.status, navigate);
      return;
    }
    const dateString = stampToInputDate(response.payload.dueDate);
    setFormValues({ ...response.payload, dueDate: dateString });
    setMembers(response.payload.members);
  };

  useEffect(() => {
    getRoleUsers();

    if (projectId) {
      dispatch(projectFormMode("update"));
      getProject(projectId);
    }
  }, []);

  return (
    <div className="h-full w-full">
      <div className="py-8">
        <h1 className="text-start px-8 font-bold text-lg text-gray-500 italic">
          {`${mode.toUpperCase()} PROJECT`}
        </h1>
      </div>
      <div className="flex flex-col w-[50%] mx-auto  h-fit p-8 bg-white rounded-lg shadow">
        <form className="h-fit flex gap-2 flex-col" onSubmit={submitHandler}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Project Name</label>
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
            <label htmlFor="members">Select Members</label>
            <MultiSelect
              options={users}
              value={members}
              onChange={setMembers}
              labelledBy="Choose Members"
            />
            {errors.members && (
              <p className="text-red-500 text-xs text-wrap">{errors.members}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              className="rounded border p-1 w-full outline-none text-black"
              value={formValues.dueDate}
              onChange={handleChange}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs text-wrap">{errors.dueDate}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="description">Description</label>
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
  );
};

export default ProjectForm;
