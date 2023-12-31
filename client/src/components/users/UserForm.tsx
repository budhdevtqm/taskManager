import { verifyStatus } from "common/utils";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { toggleMode } from "redux/authSlice";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { addUser, fetchUser, updateUser, userFormMode } from "redux/userSlice";

const roles = ["admin", "user", "superAdmin"];

interface FormValues {
  name: string;
  email: string;
  password: string;
  role: string;
  id?: string;
}

const UserForm: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState<any>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userId = useParams().id;
  const mode = useAppSelector((state) => state.users.mode) as String;

  const changeHandler = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value, name } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values: FormValues) => {
    const { name, email, password, role } = values;
    let errors: Partial<{
      name: String;
      email: String;
      password: String;
      role: String;
    }> = {};
    if (!name || name.trim() === "") {
      errors.name = "Required";
    } else if (name.trim().length < 3) {
      errors.name = "Name must be of 3 characters!";
    }

    if (!email || email.trim() === "") {
      errors.email = "Required!";
    } else if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      errors.email = "Invalid email pattern!";
    }
    if (!password || password.trim() === "") {
      errors.password = "Required!";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/.test(
        password
      )
    ) {
      errors.password =
        "Password must contain numbers, special, small and capital char!";
    }
    if (!role || role.trim() === "") {
      errors.role = "Required!";
    }
    return errors;
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const validationResults = validate(formValues);
    if (Object.keys(validationResults).length > 0) {
      setErrors(validationResults);
      return;
    }

    if (mode === "create") {
      const resp: any = await dispatch(
        addUser({ ...formValues, userRole: formValues.role })
      );
      if (resp.type === "create/user/rejected") {
        if (resp.payload.status === 409) {
          toast.error(resp.payload.message, { position: "top-right" });
        }
        verifyStatus(resp.payload.status, navigate);
        return;
      } else {
        toast.success("User created successfully.", { position: "top-right" });
        setTimeout(() => navigate("/users"), 1000);
      }
    }

    if (mode === "update") {
      const resp: any = await dispatch(
        updateUser({
          name: formValues.name,
          userRole: formValues.role,
          password: formValues.password,
          id: userId,
        })
      );
      if (resp.type !== "update/user/fulfilled") {
        verifyStatus(401, navigate);
        return;
      } else {
        setTimeout(() => navigate("/users"), 1000);
        toast.success("Updated successfully", { position: "top-right" });
      }
    }
  };

  const getUserDetails = async (id: String) => {
    const response: any = await dispatch(fetchUser(id));
    if (
      response.type === "fetch/user/fulfilled" &&
      response.payload === undefined
    ) {
      verifyStatus(401, navigate);
      return;
    } else {
      setFormValues(response?.payload?.data?.data?._doc);
      return;
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(userFormMode("update"));
      getUserDetails(userId);
    } else {
      dispatch(userFormMode("create"));
    }
  }, []);

  return (
    <div className="h-full w-full mb-8">
      <div className="p-8">
        <h1 className="text-start px-8 font-bold text-lg text-gray-500 italic">
          {mode.toUpperCase()} USER
        </h1>
      </div>
      <div className="flex flex-col w-[50%] mx-auto my-8  p-8 bg-white rounded-lg shadow ">
        <form className="flex gap-4 flex-col mb-8" onSubmit={submitHandler}>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 font-semibold" htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formValues.name}
              onChange={changeHandler}
              className="rounded border p-1 w-full outline-none text-black"
            />
            {errors.name && (
              <p className=" text-red-500 text-[13px]">{errors.name}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 font-semibold" htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={formValues.email}
              onChange={changeHandler}
              disabled={mode === "update" ? true : false}
              className="rounded border p-1 w-full outline-none text-black"
            />
            {errors.email && (
              <p className=" text-red-500 text-[13px]">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 font-semibold" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formValues.password}
              onChange={changeHandler}
              className="rounded border p-1 w-full outline-none text-black`"
            />
            {errors.password && (
              <p className="text-red-500 text-[13px]">{errors.password}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-500 font-semibold" htmlFor="role">Role</label>
            <select
              className="rounded border p-1 w-full outline-none text-black"
              name="role"
              onChange={changeHandler}
              value={formValues?.role ?? ""}
            >
              <option value="" disabled>
                --Choose--
              </option>
              {roles.map((role, index) => (
                <option key={index} value={role}>
                  {role.toUpperCase()}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className=" text-red-500 text-[13px]">{errors.role}</p>
            )}
          </div>
          <div className="mt-4 flex items-center justify-center">
            <button
              type="submit"
              className="px-4 py-2 border bg-primary text-white border-primary rounded hover:bg-white hover:text-primary"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
};

export default UserForm;
