import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import AdminLayout from "./Admin/AdminLayout/AdminLayout";
import Product from "./Admin/ProductManament/Product";
import Category from "./Admin/CategoryManagement/Category";
import UserManagement from "./Admin/UserManagement/UserManagement";
import OrderManagement from "./Admin/OrderManagement/OrderManagement";
import Authentication from "./layouts/authentication";
import OrderDetail from "./Admin/OrderManagement/OrderDetail";
import PaymentNotify from "./components/PaymentNotifiy/PaymentNotify";
import OverView from "./Admin/Overview/OverView";
import Discount from "./Admin/DiscountManagement/Discount";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import Chat from "./components/UserManagement/Chat/Chat";
import ChatManagement from "./Admin/ChatManagement/ChatManagement";
import LoadingSpinner from "./components/LoadingSpinner";
import OrderInformation from "./components/Order/OrderInformation";

function App() {
  const { isAuthenticated } = useUser();
  useEffect(() => console.log(isAuthenticated), []);
  return (
    <Router>
      <LoadingSpinner />
      <ToastContainer />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/Book/:id" element={<Detail />} />
          <Route element={<Authentication />}>
            <Route path="/User" element={<UserLayout />}>
              <Route path="/User" element={<Navigate to="/User/Account" />} />
              <Route path="/User/Account" index element={<Account />} />
              <Route path="/User/ChangePassword" element={<ChangePassword />} />
              <Route path="/User/Orders" element={<Order />} />
              <Route path="/User/Orders/:id" element={<OrderInformation />} />
              <Route path="/User/Chat" element={<Chat />} />
            </Route>
            <Route path="/Cart" element={<Cart />} />
            <Route path="/PlaceOrder" element={<PlaceOrder />} />
           
          </Route>
        </Route>
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/signin" />} />
        )}

        {/* Routes for authenticated users */}
        {/* {isAuthenticated && ( */}
        <Route element={<Authentication />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin/" element={<OverView />} />
            <Route path="/admin/Product" element={<Product />} />
            <Route path="/admin/Category" element={<Category />} />
            <Route path="/admin/User" element={<UserManagement />} />
            <Route path="/admin/Discount" element={<Discount />} />
            <Route path="/admin/Order" element={<OrderManagement />} />
            <Route path="/admin/Order/:id" element={<OrderDetail />} />
            <Route path="/admin/ChatManagement" element={<ChatManagement/>} />
            <Route path="/admin/ChangePassword" element={<ChangePassword/>} />
          </Route>
          <Route path="/PaymentNotify" element={<PaymentNotify />} />
        </Route>

        {/* )} */}

        {/* Routes for unauthenticated users */}
        {/* {!isAuthenticated && <Route element={<Navigate to="/signin" />} />} */}
      </Routes>
    </Router>
  );
}

export default App;
