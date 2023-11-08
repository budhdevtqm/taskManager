import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getTask, updateStatus } from "redux/taskSlice";
import { status } from "common/utils";
import usePatch from "hooks/usePatch";
import useFetch from "hooks/useFetch";

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
  const { update } = usePatch();
  const { fetchById } = useFetch();
  const [formValues, setFormValues] = useState({ progressStatus: "" });
  const [errors, setErrors] = useState<ErrorValues>({});
  const taskId = useParams().id as string;

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const updateHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});
    const validationResults = validate(formValues);
    if (Object.keys(validationResults).length > 0) {
      setErrors(validationResults);
      return;
    }

    await update(updateStatus, {
      id: taskId,
      ...formValues,
    });
    await fetchById(getTask, taskId);
  };

  return (
    <div className="flex items-center justify-center my-8">
      <form
        className="p-8 border-2 rounded-xl w-[50%]"
        onSubmit={updateHandler}
      >
        <div className="flex flex-col">
          <label
            className="text-gray-500 font-semibold"
            htmlFor="progressStatus"
          >
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
