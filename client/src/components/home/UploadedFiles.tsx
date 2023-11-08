import React, { useEffect } from "react";
import { ImCancelCircle } from "react-icons/im";
import {
  BsFiletypePdf,
  BsFiletypeDoc,
  BsFiletypeDocx,
  BsFiletypeXls,
  BsFiletypeTxt,
} from "react-icons/bs";
import { Toaster } from "react-hot-toast";
import { UploadedFile, deleteFile, getTaskFiles } from "../../redux/taskSlice";
import useFetch from "hooks/useFetch";
import { useAppSelector } from "redux/hooks";
import useDelete from "hooks/useDelete";

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
  const { fetchById } = useFetch();
  const handleDelete = useDelete();
  const files = useAppSelector((state) => state.tasks.files) as
    | UploadedFile[]
    | [];

  useEffect(() => {
    if (taskId) {
      fetchById(getTaskFiles, taskId);
    }
  }, []);

  const deleteHandler = async (id: string) => {
    await handleDelete(deleteFile, id);
    await fetchById(getTaskFiles, taskId);
  };
  return (
    <>
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {files.map((file: UploadedFile) => (
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
