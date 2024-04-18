import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {Outlet} from "react-router-dom"
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
function getItem(label, key, icon, children, type,onClick) {
  return {
    key,
    icon,
    children,
    label,
    type,
    onClick
  };
}
const items = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("Option 3", "3", <ContainerOutlined />),
  getItem("Navigation One", "sub1", <MailOutlined />, [
    getItem("Option 5", "5", undefined, undefined, undefined, () => navigate("/Admin/ProductManagement")),
    getItem("Option 6", "6"),
    getItem("Option 7", "7"),
    getItem("Option 8", "8"),
  ]),
  getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Submenu", "sub3", null, [
      getItem("Option 11", "11"),
      getItem("Option 12", "12"),
    ]),
  ]),
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
          height:"100% !important"
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
          style={{backgroundColor:"inherit",color:"white",padding:"20px"}}
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
