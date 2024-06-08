import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import "./layout.css";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";

const AdminLayout = () => {
  const navigate = useNavigate();
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
  const items = [
    getItem("Overview", "1", undefined, undefined, undefined, () =>
      navigate("/Admin/")
    ),
    getItem("Management", "sub1", <MailOutlined />, [
      getItem("Book Management", "2", undefined, undefined, undefined, () =>
        navigate("/Admin/Product")
      ),
      getItem("Category Management", "3", undefined, undefined, undefined, () =>
        navigate("/Admin/Category")
      ),
      getItem("User Management", "4", undefined, undefined, undefined, () =>
        navigate("/Admin/User")
      ),
      getItem("Order Management", "5", undefined, undefined, undefined, () =>
        navigate("/Admin/Order")
      ),
      getItem("Discount Management", "6", undefined, undefined, undefined, () =>
        navigate("/Admin/Discount")
      ),
    ]),
    getItem("Chat", "7", undefined, undefined, undefined, () =>
      navigate("/Admin/ChatManagement")
    ),
  ];
  const [collapsed, setCollapsed] = useState(false);
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
          defaultSelectedKeys={["1"]}
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
