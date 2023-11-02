import axios, { AxiosError } from "axios";
import { baseURL, headerConfig, verifyStatus } from "common/utils";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImCancelCircle } from "react-icons/im";
import {
  BsFiletypePdf,
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypeXls,
  BsFiletypeTxt,
} from "react-icons/bs";
import { Toaster, toast } from "react-hot-toast";

interface uploadedFile {
  createdAt: number;
  createdBy: string;
  filename: string;
  status: boolean;
  taskId: string;
  updatedAt: number;
  __v: number;
  _id: string;
}

interface PropsTypes {
  taskId: string;
}

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

const UploadedFiles: React.FC<PropsTypes> = ({ taskId }) => {
  const [uploadedFiles, setUploadedFiles] = useState<uploadedFile[] | []>([]);

  const navigate = useNavigate();

  const fetchFiles = async (taskId: string) => {
    try {
      const response = await axios.get(
        baseURL + "/task/get-files/" + taskId,
        headerConfig
      );

      setUploadedFiles(response.data.data);
    } catch (error: any) {
      verifyStatus(error?.response?.status, navigate);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchFiles(taskId);
    }
  }, []);

  const deleteHandler = async (id: string) => {
    try {
      await axios.delete(baseURL + `/task/delete/file/${id}`, headerConfig);
      toast.success("Deleted", { position: "top-right" });
      fetchFiles(taskId);
    } catch (error: any) {
      verifyStatus(error?.response?.status, navigate);
    }
  };
  return (
    <>
      {uploadedFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {uploadedFiles.map((file: uploadedFile) => (
            <div
              title={file.filename}
              key={file._id}
              className="flex flex-col border-2 rounded-lg py-3 shadow-xl"
            >
              <div className="flex items-center justify-end">
                <ImCancelCircle
                  onClick={() => deleteHandler(file._id)}
                  className="text-red-500 mx-4 text-[20px] cursor-pointer"
                  title="Delete"
                />
              </div>
              <div className="flex items-center justify-center">
                {renderFileIcon(file.filename)}
              </div>
            </div>
          ))}
        </div>
      )}
      <Toaster />
    </>
  );
};

export default UploadedFiles;
