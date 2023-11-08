import React, { useEffect, useState } from "react";
import { baseURL, headerConfig, userImage } from "common/utils";
import { useAppSelector } from "redux/hooks";
import { ProfileValues, getProfile, updateProfile } from "redux/userSlice";
import axios from "axios";
import useFetch from "hooks/useFetch";
import usePatch from "hooks/usePatch";

interface Values {
  name: string;
  email: string;
  password: string;
  image: string;
}

interface ErrorValues {
  name?: string;
  password?: string;
  image?: string;
}

const UpdateForm = () => {
  const [formValues, setFormValues] = useState<Values>({
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const { update } = usePatch();
  const { handleFetch } = useFetch();
  const [errors, setErrors] = useState<ErrorValues>({});
  const [file, setFile] = useState<any>({});

  const profile = useAppSelector(
    (state) => state.users.profile
  ) as ProfileValues | null;

  const validate = (values: Values) => {
    let errors: ErrorValues = {};
    const { name, password } = values;
    if (!name || name.trim() === "") {
      errors.name = "Please enter name!";
    } else if (name.length < 3) {
      errors.name = "Name must be at least 3 characters!";
    }
    if (!password || password.trim() === "") {
      errors.password = "Please enter password!";
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

    await update(updateProfile, { name, password });
  };

  const uploadImage = async (file: any) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post(
      baseURL + "/user/upload-image/profile",
      formData,
      headerConfig
    );
    if (response.status === 200) {
      handleFetch(getProfile);
    }
  };

  useEffect(() => {
    handleFetch(getProfile);
  }, []);

  useEffect(() => {
    if (file.name) {
      uploadImage(file);
      setFile({});
    }
  }, [file]);

  useEffect(() => {
    if (profile !== null && "name" in profile) {
      const { name, email, password, image } = profile;

      setFormValues({
        name,
        email,
        password,
        image: image ?? "",
      });
    }
  }, [profile]);

  return (
    <div className="w-[60%] mx-auto bg-white p-10 rounded-lg font-normal border-2 border-rounded">
      <h4 className="text-center my-2 font-bold">Update Profile</h4>
      <form
        className="p-8 flex flex-col gap-2"
        encType="multipart/form-data"
        onSubmit={submitHandler}
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col  gap-4  bg-grey-lighter">
            <div className="flex items-center justify-between p-3">
              <div className="p-4">
                <img
                  className=" border-2 border-primary w-[150px]"
                  src={userImage(formValues.image)}
                  alt="user-img"
                  onClick={() =>
                    window.open(userImage(formValues.image), "_blank")
                  }
                />
              </div>
              <label className=" flex flex-col items-center justify-center px-4 py-6  bg-white text-primary rounded-lg shadow-lg tracking-wide  border border-blue cursor-pointer hover:bg-teal-500 hover:text-white">
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span className="mt-2 text-base leading-normal">
                  Change Picture
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  name="image"
                  onChange={(e: any) => setFile(e.target.files[0])}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-gray-500 font-semibold" htmlFor="name">
            User Name
          </label>
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
          <label className="text-gray-500 font-semibold" htmlFor="email">
            Email
          </label>
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
          <label className="text-gray-500 font-semibold" htmlFor="password">
            Password
          </label>
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
