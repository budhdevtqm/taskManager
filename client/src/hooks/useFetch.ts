import { useAppDispatch } from "redux/hooks";
import { verifyStatus } from "common/utils";
import { useNavigate } from "react-router-dom";

const useFetch = () => {
  const disptach = useAppDispatch();
  const navigate = useNavigate();

  const handleFetch = async (fn: any) => {
    const response = await disptach(fn());

    if (response.type?.includes("rejected")) {
      verifyStatus(response.payload.status, navigate);
      console.log("Check");
      return;
    }
  };

  const fetchById = async (fn: any, id: string) => {
    const response = await disptach(fn(id));
    if (response.type?.includes("rejected")) {
      verifyStatus(response.payload.status, navigate);
      return;
    }
  };

  return { handleFetch, fetchById };
};

export default useFetch;
