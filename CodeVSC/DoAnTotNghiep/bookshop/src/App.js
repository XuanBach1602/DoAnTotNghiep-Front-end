import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import { useUser } from "./UserContext";
import MainLayout from "./layouts/layout";
import HomePage from "./components/HomePage/HomePage";
import Detail from "./components/Detail/Detail";
import Cart from "./components/Cart/Cart";
import PlaceOrder from "./components/PlaceOrder/PlaceOrder";
import UserLayout from "./components/UserManagement/UserLayout/UserLayout";
import Account from "./components/UserManagement/Account/Account";
import ChangePassword from "./components/UserManagement/ChangePassword/ChangePassword";
import Order from "./components/UserManagement/Order/Order";
function App() {
  const { isAuthenticated, setIsAuthenticated } = useUser();
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/PlaceOrder" element={<PlaceOrder />} />

        <Route path="/" element={<MainLayout />}>
          <Route path="/User" element={<UserLayout />}>
            <Route path="/User/Account" element={<Account />} />
            <Route path="/User/ChangePassword" element={<ChangePassword />} />
            <Route path="/User/Orders" element={<Order />} />
          </Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/Book/:id" element={<Detail />} />
          <Route path="/Cart" element={<Cart />} />
        </Route>
        {/* {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/signin" />} />
        )} */}
        {/* {isAuthenticated && ( */}
        {/* // <Route>
          //   <Route path="/Account" element={<Account />} />
          //   <Route path="/" element={<MainLayout />}>
          //     <Route path="/" element={<Hub />} />
          //     <Route path="/plan/:id" element={<Plan />}>
          //       <Route path="" index element={<Board />} />
          //       <Route path="schedule" element={<ScheduleCalendar />} />
          //       <Route path="grid" element={<Grid />} />
          //     </Route>
          //   </Route>
          // </Route> */}
        {/* )} */}
      </Routes>
    </Router>
  );
}

export default App;
