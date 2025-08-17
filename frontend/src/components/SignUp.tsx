import { useEffect, useState } from "react";
import { auth } from "../wrapper/authWrapper.tsx";
import { NavLink } from "react-router";

const SignUp = () => {
  const { handleSignUp } = auth();
  type TData = {
    name: string;
    email: string;
    password: string;
  };
  const [formData, setFormData] = useState<TData>({
    name: "",
    email: "",
    password: "",
  });
  // const [error, setError] = useState<string>("");
  // const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<String>("password");
  const [eyeIcon, setEyeIcon] = useState<any>(
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        // strokeWidth={1.5}
        // stroke="currentColor"
        className="size-6"
      >
        <path
          // strokeLinecap="round"
          // strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
        />
        <path
          // strokeLinecap="round"
          // strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    </>
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };


  useEffect(() => {
    showPassword === "password"
      ? setEyeIcon(
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          </>
        )
      : setEyeIcon(
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </>
        );
  }, [showPassword]);
  return (
    <div className="w-full h-[calc(100dvh-84px)] flex flex-row justify-center rounded-4xl backdrop-brightness-110 border border-current/10 overflow-hidden">
      <form className="flex flex-col gap-6 z-2 h-fit justify-center mt-10 pt-4 pb-8 rounded-lg w-80 px-6 py-8 ring shadow-lg shadow-accent-content/25 bg-[#6666661a] backdrop-blur-[1px]">
        Sign Up
        <div className="relative">
          {/* <span className="absolute text-[0.8rem] top-[-12px] left-[12px] backdrop-blur-sm bg-base-100 z-3 p-0 pr-1 pl-1 rounded-tl-2xl rounded-br-2xl">
            Full Name
          </span> */}
          <input
            type="name"
            name="name"
            placeholder="Enter Full Name"
            required
            onChange={handleChange}
            // disabled
            // ={validateEmail}
            // onBlur={validateEmail}

            className={`p-2 w-full border rounded user-invalid:border-red-500 focus:border-accent focus:outline-1 focus:outline-accent
          `}
          />
        </div>
        <div className="relative">
          {/* <span className="absolute text-[0.8rem] top-[-12px] left-[12px] backdrop-blur-sm bg-base-100 z-3 p-0 pr-1 pl-1 rounded-tl-2xl rounded-br-2xl">
            Email ID
          </span> */}
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            required
            onChange={handleChange}
            // disabled
            // ={validateEmail}
            // onBlur={validateEmail}

            className={`w-full p-2 border rounded focus:border-accent focus:outline-1 focus:outline-accent
          `}
          />
        </div>
        <div className="relative">
          <input
            type={`${showPassword}`}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            // disabled
            required
            className="p-2 pr-[35px] w-full rounded border user-invalid:border-red-500 focus:border-accent focus:outline-1 focus:outline-accent"
          />
          <button
            type="button"
            className="absolute right-2 top-2.5 text-sm text-black-500 cursor-pointer"
            onClick={() => {
              showPassword === "password"
                ? setShowPassword("text")
                : setShowPassword("password");
            }}
          >
            {eyeIcon}
          </button>
          {/* <span className="absolute text-[0.8rem] top-[-12px] left-[12px] backdrop-blur-sm bg-base-100 z-3 p-0 pr-1 pl-1 rounded-tl-2xl rounded-br-2xl">
            Password
          </span> */}
        </div>
        {/* {error && <VibratingError key={error} error={error} />} */}
        <button
          type="button"
          className="bg-orange-600 text-white px-4 py-1 rounded-md hover:bg-orange-500 transition-colors duration-200"
          onClick={() => handleSignUp(formData)}
        >
          Sign Up
        </button>
        <div className="text-[0.8rem]">
          Already have an account?{" "}
          <NavLink
            to="/signin"
            className="text-accent text-orange-600 hover:underline active:scale-90 active:underline"
          >
            {" "}
            Sign In
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
