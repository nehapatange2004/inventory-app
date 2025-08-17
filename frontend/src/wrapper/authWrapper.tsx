import axios from "axios";
import { createContext, useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

const Authcontext = createContext<any | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageReloaded, setPageReloaded] = useState<boolean>(false);
  const [theme, setTheme] = useState<String>("dark");
  const location = useLocation();
  const navigate = useNavigate();

  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<{
    _id: string;
    name: string;
    email: string;
    
  }>();

   const handlelogout = () => {
    setIsUserLoggedIn(false);
    localStorage.removeItem("token");
    navigate("/signin");
    toast.success("Logged out successfully!");
    
  };
  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found after reload!");
        setIsUserLoggedIn(false);
        setLoading(false);
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/auth/dash`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.data;
      console.log("RESPONSE DATA: ", data);
      setIsUserLoggedIn(true);
      setUserDetails(data);
      
      // toast.success("Logged in successfully!");
    } catch (err) {
      console.log("Error: ", err);
      if (location.pathname === "/") {
        setLoading(false);
        return;
      }
      navigate("/signin");
    } finally {
      setPageReloaded(false);
      setLoading(false);
    }
  };
  const handleSignIn = async (formData: {
    email: string;
    password: string;
  }) => {
    try {
      const backend = import.meta.env.VITE_BACKEND_API;

      setLoading(true);
      if (!formData.email || !formData.password) {
        toast.error("All fields are required!");
        return;
      }
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!pattern.test(formData.email)) return toast.error("Invalid email id");

      console.log("Email: ", formData.email);
      console.log("Password: ", formData.password);

      const response = await axios.post(`${backend}/api/auth/signin`, {
        email: formData.email,
        password: formData.password,
      });
      const data = await response.data;
      const token = data.token;
      console.log("TOKEN Fetched: ", token);
      if (!data.token) {
        toast.error(`${data.error}`);
        setIsUserLoggedIn(false);
        return;
      }
      localStorage.setItem("token", `${token}`);
      console.log(localStorage.getItem("token"));
      await setIsUserLoggedIn(true);
      await setUserDetails(data);
      toast.success("Logged in successfully!");
      
      // const nav = data.role==="admin"?"/admin": location.state?.from || "/user";
      // console.log("role: ", data.role)
      // console.log("this will navigate to: ", location.state?.from);
      navigate("/", { replace: true });
      console.log("sent to sever!");
    } catch (err: any) {
      console.log("Error status: ", err);
      toast.error(err?.response.data.error);
      console.log(err?.response?.statusText);
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = async (formData: {
    name: string;
    email: string;
    password: string;
    
  }) => {
    try {
      setLoading(true);
      if (!formData.email || !formData.name || !formData.password) {
        toast.error("All fields are reqiured");
        return;
      }
      if (formData.password.length < 5) {
        toast.error("Password is too short!");
        return;
      }
      const backend = import.meta.env.VITE_BACKEND_API;
      const response = await axios.post(`${backend}/api/auth/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profilepic: "https://t4.ftcdn.net/jpg/05/89/93/27/240_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
      });
      const data = await response.data;
      const token = data.token;
      console.log("Data Fetched: ", data);
      if (data.token) {
        localStorage.removeItem("token");
        localStorage.setItem("token", `${token}`);
        console.log(localStorage.getItem("token"));
        await setIsUserLoggedIn(true);
        //   window.location.href = "/dashboard";
        toast.success("Account created successfully!");
        navigate("/user");
      }
    } catch (err: any) {
      console.log("Status: ", err);
      // console.log(res.data);

      console.log(err?.response?.statusText);
      if (err?.response?.status === 403) {
        toast.error("User already exits!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Authcontext.Provider
      value={{
        isUserLoggedIn,
        setIsUserLoggedIn,
        userDetails,
        setUserDetails,
        pageReloaded,
        setPageReloaded,
        loading,
        setLoading,
        handleSignIn,
        handleSignUp,
        checkAuth,
        handlelogout,
        theme,
        setTheme,
      }}
    >
      {children}
    </Authcontext.Provider>
  );
};
export const auth = () => useContext<any>(Authcontext);

export default AuthProvider;
