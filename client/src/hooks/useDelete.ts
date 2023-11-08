import { useAppDispatch } from "redux/hooks";
import { successToast, verifyStatus } from "common/utils";
import { useNavigate } from "react-router-dom";

const useDelete = () => {
  const navigate = useNavigate();
  const disptach = useAppDispatch();

  const handleDelete = async (fn: any, id: string) => {
    const response = await disptach(fn(id));

    if (response.type?.includes("fulfilled")) {
      successToast("delete");
      return;
    }
    if (response.type?.includes("rejected")) {
      verifyStatus(response.payload.status, navigate);
    }
  };
  return handleDelete;
};

export default useDelete;
