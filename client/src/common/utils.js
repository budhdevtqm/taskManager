import { toast } from "react-hot-toast";

export const baseURL = "http://localhost:4000";

export const authToken = localStorage.getItem("token");

export const types = ["Frontend", "Backend", "Testing", "Design", "FullStack"]

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
  if (text.length < 42) {
    return text;
  }
  return text.substring(0, 42) + "...";
};

export const Priority = (priority) => {
  if (priority === "low") {
    return (
      <span
        className="bg-green-500 text-[13px] text-white font-semibold  px-[18px] rounded-xl"
        title={priority}
      >
        {priority[0].toUpperCase()}
      </span>
    );
  } else if (priority === "medium") {
    return (
      <span
        className="bg-yellow-500 text-[13px] text-white font-semibold  px-[18px] rounded-xl"
        title={priority}
      >
        {priority[0].toUpperCase()}
      </span>
    );
  } else {
    return (
      <span
        className="bg-orange-700 text-[13px] text-white px-[18px] font-semibold rounded-xl"
        title={priority}
      >
        {priority[0].toUpperCase()}
      </span>
    );
  }
};
