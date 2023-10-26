import React, { useState } from "react";
import { signup, toggleMode, mailSetter } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/hooks";
import { Toaster, toast } from "react-hot-toast";

interface Initials {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [formValues, setFormValues] = useState<Initials>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    let errors: any = {};
    const { name, email, password } = values;

    if (!name || name.trim() === "") {
      errors.name = "Please enter name!";
    } else if (name.trim().length < 3) {
      errors.name = "name must be of 3 characters!";
    }

    if (!email || email.trim() === "") {
      errors.email = "Please enter email!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid Email!";
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

    const validatonResults = validate(formValues);
    if (Object.keys(validatonResults).length > 0) {
      setErrors(validatonResults);
      return;
    } else {
      const response: any = await dispatch(signup(formValues));

      if (response.type === "/signup-user/fulfilled") {
        toast.success(`${response?.payload?.data?.message}`, {
          position: "top-right",
        });
        setTimeout(() => dispatch(mailSetter(formValues.email)), 1500);
      }

      if (response.type === "/signup-user/rejected") {
        toast.error(response?.payload?.response?.data?.message, {
          position: "top-right",
        });
      }
    }
  };

  return (
    <section className="bg-primary rounded w-[70%] px-8 pt-16 pb-8 text-white flex flex-col shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
      <h1 className="text-center text-4xl px-auto py-2 my-1 ">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter full name"
            className="rounded p-1 w-full outline-none text-black"
            value={formValues.name}
            onChange={handleChange}
          />
          {errors.name && (
            <div className="text-errorWhite text-[13px]">{errors?.name}</div>
          )}
        </div>
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
            className="rounded p-1 w-full outline-none text-black"
            placeholder="Add your password"
            value={formValues.password}
            onChange={handleChange}
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
          Already have account please{" "}
          <strong
            onClick={() => dispatch(toggleMode())}
            className="text-italic cursor-pointer"
          >
            Login
          </strong>
        </h5>
      </div>
      <Toaster />
    </section>
  );
};

export default Signup;
