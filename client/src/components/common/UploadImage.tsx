import React from "react";

interface UploadImageProps {
  multiple: boolean;
  accept: string;
}

const UploadImage: React.FC<UploadImageProps> = ({ multiple, accept }) => {
  return (
    <div className="flex justify-between bg-[#EAF4FC] p-4 rounded gap-4">
      <div className="flex gap-4 flex-col">
        <div className="flex justify-start items-center">
          <input
            type="file"
            multiple={multiple ?? false}
            accept={accept ?? ".jpg .png .jpeg"}
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
