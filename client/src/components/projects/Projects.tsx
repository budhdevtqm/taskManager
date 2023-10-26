import React, { useState, useEffect } from "react";
import { getDate, getTime, verifyStatus } from "common/utils";
import { BsInfoCircle, BsPencil, BsTrash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ViewProject from "./ViewProject";
import { deleteProject, getAllProjects, Project, projectFormMode } from "redux/projectSlice";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { Toaster, toast } from "react-hot-toast";

const Projects: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const projects = useAppSelector(
    (state) => state.projects.projects
  ) as Array<Project>;

  const handleOpen = (project: Project) => {
    setOpen(!open);
    if (Object.keys(project).length > 0) {
      setProject(project);
      return;
    }
  };

  const getProjects = async () => {
    const response = await dispatch(getAllProjects());
    if (response.type === "fetch/projects/rejected") {
      verifyStatus(response.payload.status, navigate);
      return;
    }
  };

  const handleDelete = async (id: String) => {
    const resp: any = await dispatch(deleteProject(id));
    if (resp.type !== "/delete-project/fulfilled") {
      verifyStatus(resp.payload.status, navigate);
      return;
    }

    toast.success("Deleted", { position: "top-right" });
    getProjects();
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getProjects();
    dispatch(projectFormMode("create"));
  }, []);

  return (
    <React.Fragment>
      {open && (
        <ViewProject
          open={open}
          setOpen={handleClose}
          project={project as Project}
        />
      )}
      {!open && (
        <div>
          <div className="flex justify-between items-center px-8 py-4">
            <h1>Projects</h1>
            <button
              className="flex items-center gap-3 hover:bg-primary px-4 py-1 hover:text-white rounded text-primary border:primary bg-white"
              type="button"
              onClick={() => navigate("/projects/create")}
            >
              ADD
            </button>
          </div>

          <div className=" w-[80%] my-4 mx-auto shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Added On
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    isActive
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody>
                {projects &&
                  projects.map((project: Project, index) => (
                    <tr key={index}>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex">
                          <div className="ml-3">
                            <p className="text-gray-800 whitespace-no-wrap font-bold italic">
                              {project?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {project?.createdBy?.name}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">
                          {getDate(project?.createdAt)}
                        </p>
                        <p className="text-gray-600 whitespace-no-wrap">
                          {getTime(project?.createdAt)}
                        </p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        {project.status ? (
                          <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span
                              aria-hidden
                              className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                            ></span>
                            <span className="relative">Yes</span>
                          </span>
                        ) : (
                          <span className="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
                            <span
                              aria-hidden
                              className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"
                            ></span>
                            <span className="relative">No</span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-8 border-b border-gray-200 bg-white text-sm text-right flex gap-2  cursor-pointer text-lg">
                        <BsInfoCircle
                          title="Info"
                          onClick={() => handleOpen(project)}
                        />
                        <BsPencil
                          title="Edit"
                          onClick={() =>
                            navigate(`/projects/update/${project?._id}`)
                          }
                        />
                        <BsTrash
                          title="Delete"
                          onClick={() => handleDelete(project?._id)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Toaster />
    </React.Fragment>
  );
};

export default Projects;
