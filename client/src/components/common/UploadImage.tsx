import React from "react";

interface UploadImageProps {
  multiple: boolean;
  accept: string;
}

const UploadImage: React.FC<UploadImageProps> = ({ multiple, accept }) => {
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log("target", e);
  //   const { name, files } = e.target as any;
  //   set({...file,})
  //   console.log("files", files[0]);
  // };
  return (
    <div className="flex justify-between bg-secondary p-4 rounded gap-4">
      <div className="flex gap-4 flex-col">
        <div className="flex justify-start items-center">
          <input
            type="file"
            multiple={multiple ?? false}
            accept={accept ?? ".jpg .png .jpeg"}
            // onChange={handleChange}
            name={"image"}
          />
        </div>
        <div>
          <button
            type="button"
            className="font-semi-bold py-1 px-3 rounded bg-primary text-white"
          >
            Upload
          </button>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default UploadImage;
