import React, { useState } from "react";
import { toggleMode, loginHandler } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

interface login {
  email: string;
  password: string;
}

const Login = () => {
  const [formValues, setFormValues] = useState<login>({
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<login>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values: { email: string; password: string }) => {
    const { email, password } = values;
    let errors: any = {};
    if (!email || email.trim() === "") {
      errors.email = "Please enter email!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid Email";
    }
    if (!password || password.trim() === "") {
      errors.password = "Please enter password!";
    } else if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/.test(
        password
      )
    ) {
      errors.password =
        "Password must contain numbers, special, small and capital char!";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResults = validate(formValues);
    if (Object.keys(validationResults).length > 0) {
      setErrors(validationResults);
      return;
    }
    const resp: any = await dispatch(loginHandler(formValues));
    if (resp.type === "/login/rejected") {
      toast.error(resp.payload.response.data.message, {
        position: "top-right",
      });
      return;
    }

    toast.success(resp.payload.data.message, { position: "top-right" });
    setTimeout(() => {
      localStorage.setItem("token", resp.payload.data.token);
      window.location.assign(window.location.origin);
    }, 1000);
  };

  return (
    <section className="bg-primary rounded w-[70%] px-8 pt-16 pb-8 text-white flex flex-col shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
      <h1 className="text-center text-4xl px-auto py-2 my-1 ">Login</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            className="rounded p-1 w-full outline-none text-black"
            placeholder="Enter your email"
            value={formValues.email}
            onChange={handleChange}
          />
          {errors.email && (
            <div className="text-errorWhite text-[13px]">{errors.email}</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={formValues.password}
            onChange={handleChange}
            className="rounded p-1 w-full outline-none text-black"
          />
          {errors.password && (
            <div className="text-errorWhite text-[13px]">{errors.password}</div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="px-4 py-2 border rounded hover:bg-white hover:text-primary"
          >
            Submit
          </button>
        </div>
      </form>
      <div>
        <h5 className="my-4 text-center">
          New user please{" "}
          <strong
            onClick={() => dispatch(toggleMode())}
            className="text-italic cursor-pointer"
          >
            Sign Up
          </strong>
        </h5>
        <Toaster />
      </div>
    </section>
  );
};

export default Login;
