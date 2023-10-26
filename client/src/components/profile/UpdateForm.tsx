import { verifyStatus } from "common/utils";
import UploadImage from "components/common/UploadImage";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { ProfileValues, getProfile, updateProfile } from "redux/userSlice";

interface Values {
  name: string;
  email: string;
  password: string;
}

interface ErrorValues {
  name?: string;
  password?: string;
}

const UpdateForm = () => {
  const [formValues, setFormValues] = useState<Values>({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState<ErrorValues>({});

  const validate = (values: Values) => {
    let errors: ErrorValues = {};
    const { name, password } = values;
    if (!name || name.trim() === "") {
      errors.name = "Required!";
    } else if (name.length < 3) {
      errors.name = "Name must be at least 3 characters!";
    }
    if (!password || password.trim() === "") {
      errors.password = "Required!";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/.test(
        password
      )
    ) {
      errors.password =
        "Password must contain numbers, special, small, and capital characters!";
    }
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const validationResults = validate(formValues);
    if (Object.keys(validationResults).length > 0) {
      setErrors(validationResults);
      return;
    }
    const { name, password } = formValues;

    const resp: any = await dispatch(updateProfile({ name, password }));

    if (resp.type === "/update-profile/fulfilled") {
      toast.success("Profile Updated.", { position: "top-right" });
      return;
    }
    verifyStatus(resp.payload.status, navigate);
  };

  const fetchPorfileData = async () => {
    const response: any = await dispatch(getProfile());
    if (response.type !== "/fetch-profile/fulfilled") {
      verifyStatus(response.payload.status, navigate);
      return;
    }
    const { name, email, password } = response.payload.data.data;
    setFormValues({
      name,
      email,
      password,
    });
  };

  useEffect(() => {
    fetchPorfileData();
  }, []);

  return (
    <div className="w-[60%] mx-auto bg-white p-10 rounded-lg font-normal border-2 border-rounded">
      <h4 className="text-center my-2 font-bold">Update Profile</h4>
      <form className="p-8 flex flex-col gap-2" onSubmit={submitHandler}>
        <div className="flex flex-col gap-2">
          {/* <label htmlFor="name">User Name</label> */}
          <UploadImage multiple={false} accept="" />
          {/* {errors.image && (
            <p className="text-[13px] text-red-500">{errors.image}</p>
          )} */}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name">User Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="rounded p-1 w-full outline-none text-black border"
            value={formValues.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-[13px] text-red-500">{errors.name}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            disabled
            value={formValues.email}
            className="rounded p-1 w-full outline-none text-black border"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter new passowrd"
            onChange={handleChange}
            className="rounded p-1 w-full outline-none text-black border"
          />
          {errors.password && (
            <p className="text-[13px] text-red-500">{errors.password}</p>
          )}
        </div>
        <div className="flex items-center justify-center my-4">
          <button
            type="submit"
            className="px-4 py-2 border text-primary border-primary rounded hover:bg-primary hover:text-white"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateForm;
