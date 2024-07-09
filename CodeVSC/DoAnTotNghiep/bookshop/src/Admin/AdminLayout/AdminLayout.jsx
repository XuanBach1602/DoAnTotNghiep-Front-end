import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";
import {
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BookOutlined,
  SettingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  MessageOutlined,
  LockOutlined,
  LogoutOutlined,
  DashboardOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import { postAsync } from "../../Apis/axios";
import { Button, Menu } from "antd";
import { useUser } from "../../UserContext";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState("1");
  const [collapsed, setCollapsed] = useState(false);

  const pathToKey = {
    "/Admin/Product": "2",
    "/Admin/Category": "3",
    "/Admin/User": "4",
    "/Admin/Order": "5",
    "/Admin/Discount": "6",
    "/Admin/ChatManagement": "7",
    "/Admin/ChangePassword": "8",
  };

  useEffect(() => {
    const path = window.location.pathname;
    const key = Object.keys(pathToKey).find(key => path.startsWith(key)) || "1";
    setSelectedKey(pathToKey[key] || "1");
  }, []);

  const handleNavigate = (path, key) => {
    navigate(path);
    setSelectedKey(key);
  };

  function getItem(label, key, icon, children, type, onClick) {
    return {
      key,
      icon,
      children,
      label,
      type,
      onClick,
    };
  }
  const {setUser,setIsAuthenticated,fetchCartData} = useUser();
  const SignOut = async () => {
    try {
      var res = await postAsync(`/api/Auth/SignOut`);
      Cookies.remove('token');
      navigate("/")
      toast.success("Sign out successfully", {
          autoClose: 1000,
        });
      setUser(null);
        setIsAuthenticated(false);
        fetchCartData();
    } catch (error) {
    }
  }

  const items = [
    getItem("Overview", "1", <DashboardOutlined className="management-icon" />, undefined, undefined, () =>
      handleNavigate("/Admin/", "1")
    ),
    getItem("Management", "sub1", <AppstoreOutlined className="management-icon" />, [
      getItem("Book Management", "2", <BookOutlined className="management-icon"/>, undefined, undefined, () =>
        handleNavigate("/Admin/Product", "2")
      ),
      getItem("Category Management", "3", <AppstoreOutlined className="management-icon"/>, undefined, undefined, () =>
        handleNavigate("/Admin/Category", "3")
      ),
      getItem("User Management", "4", <UserOutlined className="management-icon"/>, undefined, undefined, () =>
        handleNavigate("/Admin/User", "4")
      ),
      getItem("Order Management", "5", <ShoppingCartOutlined className="management-icon"/>, undefined, undefined, () =>
        handleNavigate("/Admin/Order", "5")
      ),
      getItem("Discount Management", "6", <TagOutlined className="management-icon"/>, undefined, undefined, () =>
        handleNavigate("/Admin/Discount", "6")
      ),
    ]),
    getItem("Chat", "7", <MessageOutlined className="management-icon"/>, undefined, undefined, () =>
      handleNavigate("/Admin/ChatManagement", "7")
    ),
    getItem("Change Password", "8", <LockOutlined className="management-icon"/>, undefined, undefined, () =>
      handleNavigate("/Admin/ChangePassword", "8")
    ),
    getItem("Sign Out", "9", <LogoutOutlined className="management-icon"/>, undefined, undefined, () =>
      SignOut()
    ),
  ];

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="admin-layout-container">
      <div
        className="side-bar-admin"
        style={{
          width: "fit-content",
          height: "100% !important",
        }}
      >
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{
            marginBottom: 16,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          selectedKeys={[selectedKey]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          style={{
            backgroundColor: "inherit",
            color: "white",
            padding: "20px",
          }}
          inlineCollapsed={collapsed}
          items={items}
        />
      </div>
      <div className="admin-layout-main">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
