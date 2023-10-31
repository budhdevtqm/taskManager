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
   <></>
  );
};

export default UploadImage;

// <div classNameName="flex justify-between bg-secondary p-4 rounded gap-4">
//   <div classNameName="flex gap-4 flex-col">
//     <div classNameName="flex flex-col justify-start items-center">
//       <input
//         type="file"
//         hidden={true}
//         multiple={multiple ?? false}
//         accept={accept ?? "image/*"}
//         // onChange={handleChange}
//         name={"image"}
//         classNameName="flex flex-col"
//       />
//     </div>
//     <div>
//       <button
//         type="button"
//         classNameName="font-semi-bold py-1 px-3 rounded bg-primary text-white"
//       >
//         Upload
//       </button>
//     </div>
//   </div>
//   <div></div>
// </div>
