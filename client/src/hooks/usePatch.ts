import { useAppDispatch } from "redux/hooks";
import { useNavigate } from "react-router-dom";
import { verifyStatus, successToast } from "common/utils";

const usePatch = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const update = async (fn: any, values: any) => {
    const response = await dispatch(fn(values));

    if (response.type?.includes("fulfilled")) {
      successToast("update");
    }

    if (response.type?.includes("rejected")) {
      verifyStatus(response.payload.status, navigate);
    }
  };
  return { update };
};

export default usePatch;
