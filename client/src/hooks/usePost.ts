import { useAppDispatch } from "redux/hooks";
import { verifyStatus, successToast } from "common/utils";
import { useNavigate } from "react-router-dom";

const usePost = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const create = async (fn: any, values: any) => {
    const response = await dispatch(fn(values));

    if (response.type?.includes("fulfilled")) {
      successToast("create");
      return;
    }
    if (response.type?.includes("rejected")) {
      verifyStatus(response.payload.status, navigate);
    }
  };

  return { create };
};

export default usePost;
