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
import AdminLayout from "./Admin/AdminLayout/layout";
import BookTable from "./Admin/ProductManament/BookTable";

function App() {
  const { isAuthenticated } = useUser();
  useEffect(() => console.log(isAuthenticated),[])
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/Book/:id" element={<Detail />} />
        </Route>
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/signin" />} />
        )}
        <Route path="/admin" element={<AdminLayout />} >
        <Route path="/admin/ProductManagement" element={<BookTable />} />
          </Route>
        {/* Routes for authenticated users */}
        {isAuthenticated && (
          <Route element={<MainLayout />}>
            <Route path="/User" element={<UserLayout />}>
              <Route path="/User" element={<Navigate to="/User/Account" />} />
              <Route path="/User/Account" index element={<Account />} />
              <Route path="/User/ChangePassword" element={<ChangePassword />} />
              <Route path="/User/Orders" element={<Order />} />
            </Route>
            <Route path="/Cart" element={<Cart />} />
            <Route path="/PlaceOrder" element={<PlaceOrder />} />
          </Route>
          
        )}

        {/* Routes for unauthenticated users */}
        {!isAuthenticated && <Route element={<Navigate to="/signin" />} />}
      </Routes>
    </Router>
  );
}

export default App;
