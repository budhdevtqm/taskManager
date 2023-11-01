import { toast } from "react-hot-toast";

export const baseURL = "http://localhost:4000";

export const authToken = localStorage.getItem("token");

export const types = ["Frontend", "Backend", "Testing", "Design", "FullStack"];

export const status = ["pending", "in progress", "complete"];

export const priority = ["low", "medium", "high"];

export const headerConfig = {
  headers: { authorization: `Bearer ${authToken}` },
};

export const getDate = (timeStamp) => {
  const string = new Date(timeStamp - 19800000).toDateString();
  return string;
};

export const getTime = (timeStamp) => {
  const string = new Date(timeStamp - 19800000).toLocaleTimeString();
  return string;
};

export const verifyStatus = (status, navigate) => {
  if (status === 401 || status === 498 || status === 500) {
    toast.error("Invalid Token", { position: "top-right" });
    setTimeout(() => navigate("/auth"), 1000);
  }

  if (status === 400) {
    toast.error("Something went wrong!", { position: "top-right" });
  }

  if (status === 403) {
    toast.error("Access Denied", { position: "top-right" });
    setTimeout(() => navigate("/home"), 1000);
  }
};

export const stampToInputDate = (stamp) => {
  if (stamp > 0) {
    let str = new Date(stamp).toLocaleDateString();
    let split = str.split("/");
    return `${split[2]}-${split[1]}-${split[0]}`;
  }
  return "";
};

export const makeTitlePerfect = (text) => {
  if (text.length < 150) {
    return text;
  }
  return text.substring(0, 150) + "...";
};

export const priorityClass = (priority, type) => {
  if (type === "border") {
    if (priority === "low") {
      return "border border-green-500 ";
    } else if (priority === "medium") {
      return "border border-yellow-500";
    } else {
      return "border border-red-500";
    }
  }

  if (type === "color") {
    if (priority === "low") {
      return "text-green-500 ";
    } else if (priority === "medium") {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  }
};

export const userImage = (url) => {
  if (url) {
    return `${baseURL}/images/users/${url}`;
  } else {
    return "/images/user.png";
  }
};

export const makeFileNameClean = (fileName) => {
  let firstName = fileName.substring(0, 7);
  let splitFleName = fileName.split(".");
  const ext = splitFleName[splitFleName.length - 1];
  return `${firstName.trim()}.${ext}`;
};



// import { toast } from "react-hot-toast";

// export const baseURL = "http://localhost:4000";

// export const authToken = localStorage.getItem("token");

// export const types = ["Frontend", "Backend", "Testing", "Design", "FullStack"];

// export const status = ["pending", "in progress", "complete"];

// export const priority = ["low", "medium", "high"];

// export const headerConfig = {
//   headers: { authorization: `Bearer ${authToken}` },
// };

// export const getDate = (timeStamp) => {
//   const string = new Date(timeStamp - 19800000).toDateString();
//   return string;
// };

// export const getTime = (timeStamp) => {
//   const string = new Date(timeStamp - 19800000).toLocaleTimeString();
//   return string;
// };

// export const verifyStatus = (status, navigate) => {
//   if (status === 401 || status === 498 || status === 500) {
//     toast.error("Invalid Token", { position: "top-right" });
//     setTimeout(() => navigate("/auth"), 1000);
//   }

//   if (status === 400) {
//     toast.error("Something went wrong!", { position: "top-right" });
//   }

//   if (status === 403) {
//     toast.error("Access Denied", { position: "top-right" });
//     setTimeout(() => navigate("/home"), 1000);
//   }
// };

// export const stampToInputDate = (stamp) => {
//   if (stamp > 0) {
//     let str = new Date(stamp).toLocaleDateString();
//     let split = str.split("/");
//     return `${split[2]}-${split[1]}-${split[0]}`;
//   }
//   return "";
// };

// export const makeTitlePerfect = (text) => {
//   if (text.length < 150) {
//     return text;
//   }
//   return text.substring(0, 150) + "...";
// };

// export const priorityClass = (priority, type) => {
//   if (type === "border") {
//     if (priority === "low") {
//       return "border border-green-500 ";
//     } else if (priority === "medium") {
//       return "border border-yellow-500";
//     } else {
//       return "border border-red-500";
//     }
//   }

//   if (type === "color") {
//     if (priority === "low") {
//       return "text-green-500 ";
//     } else if (priority === "medium") {
//       return "text-yellow-500";
//     } else {
//       return "text-red-500";
//     }
//   }
// };

// export const userImage = (url) => {
//   if (url) {
//     return `${baseURL}/images/users/${url}`;
//   } else {
//     return "/images/user.png";
//   }
// };
