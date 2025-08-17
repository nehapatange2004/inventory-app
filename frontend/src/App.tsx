import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import InventoryList from "./components/InventoryList";
import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router";
import AddProductForm from "./components/AddProductForm";
import { Toaster } from "react-hot-toast";
import SingleProductView from "./components/SingleProductView";
import SignIn from "./components/Signin";
import SignUp from "./components/SignUp";
import { auth } from "./wrapper/authWrapper";
import OrderPage from "./components/OrderPage";
import AdminProfile from "./components/AdminProfile";
import EditProduct from "./components/EditProduct";
import UserProfile from "./components/UserProfile";
import TrackOrder from "./components/TrackOrder";
import StripePayment from "./components/StripePayment";
import Loader from "./components/loader";
import SuccessPage from "./components/Success";
import ErrorPage from "./components/ErrorPage";

function App() {
  const { checkAuth, userDetails, loading } = auth();
  useEffect(() => {
    checkAuth();
    console.log("authentication preceeded");
  }, []);
  return (
    <div className="flex flex-col flex-wrap align-center justify-center min-w-[100vw]">
      <Toaster />
      <Navbar />
      <div className="h-screen px-2">
        <Routes>
          <Route path="/" element={<InventoryList />} />

          <Route
            path="/admin"
            element={
              userDetails?.role === "admin" ? (
                <AdminProfile />
              ) : (
                <>Unauthorized</>
              )
            }
          />
          <Route path="/user" element={<TrackOrder />} />

          <Route path="/admin/edit/:id" element={<EditProduct />} />
          <Route path="admin/add" element={<AddProductForm />} />

          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
       
          <Route path="/stripe" element={<StripePayment />} />
          <Route path="/product/:id" element={<SingleProductView />} />
          <Route path='/success' element={<SuccessPage/>}/>
          <Route path='/error' element={<ErrorPage/>}/>
        </Routes>
        {loading && <Loader />}
      </div>
    </div>
  );
}

export default App;
