import React, { SetStateAction, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "redux/hooks";
import { getTask, updateStatus } from "redux/taskSlice";

import { toast } from "react-hot-toast";
import { status, verifyStatus } from "common/utils";

type SetStateFunction = (status: boolean) => void;

interface ErrorValues {
  progressStatus?: String;
}

const validate = (values: { progressStatus: String }) => {
  const errors: ErrorValues = {};
  const { progressStatus } = values;
  if (!progressStatus || progressStatus.trim() === "") {
    errors.progressStatus = "Required!";
  }
  return errors;
};

const TaskStatusForm: React.FC = () => {
  const [formValues, setFormValues] = useState({ progressStatus: "" });
  const [errors, setErrors] = useState<ErrorValues>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const taskId = useParams().id as string;

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const getTaskDetails = async (id: String) => {
    const response: any = await dispatch(getTask(id));
    if (response.type === "/get-task/rejected") {
      verifyStatus(response.payload.status, navigate);
      return;
    }
  };

  const updateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    const validationResults = validate(formValues);
    if (Object.keys(validationResults).length > 0) {
      setErrors(validationResults);
      return;
    }

    const response: any = await dispatch(
      updateStatus({ id: taskId, ...formValues })
    );

    if (response.type === "/update-status/fulfilled") {
      toast.success(response.payload.data.message, { position: "top-right" });
      getTaskDetails(taskId);
      return;
    }
    verifyStatus(response.payload.status, navigate);
  };

  return (
    <div className="flex items-center justify-center my-8">
      <form
        className="p-8 border-2 rounded-xl w-[50%]"
        onSubmit={updateHandler}
      >
        <div className="flex flex-col">
          <label className="text-gray-500 font-semibold" htmlFor="progressStatus">
            Update Status
          </label>
          <select
            name="progressStatus"
            id="progressStatus"
            className="border-2 rounded p-1"
            onChange={changeHandler}
            value={formValues.progressStatus}
          >
            <option value="">None</option>
            {status.map((s, index) => (
              <option key={index} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.progressStatus && (
            <p className="text-red-500 text-[13px]">{errors.progressStatus}</p>
          )}
        </div>
        <div className="flex items-center justify-center mt-4">
          <button
            className="px-4 py-2 border text-primary border-primary rounded hover:bg-primary hover:text-white"
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskStatusForm;
