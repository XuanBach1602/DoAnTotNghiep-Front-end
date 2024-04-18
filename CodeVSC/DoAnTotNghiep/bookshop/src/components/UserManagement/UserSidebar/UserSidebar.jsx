import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppstoreOutlined, MailOutlined } from '@ant-design/icons';
import { getAsync, postAsync } from '../../../Apis/axios';
import { Menu } from 'antd';
import { useUser } from '../../../UserContext';
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

const UserSidebar = () => {

function getItem(label, key, icon, children, type, onClick) {
  return {
    key,
    icon,
    children,
    label,
    type,
    onClick, // Thêm thuộc tính onClick cho mỗi item
  };
}

const {setUser,setIsAuthenticated} = useUser();
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
  } catch (error) {
  }
}

const items = [
  getItem('My account', '1', <MailOutlined />, [
    getItem('Account information', '11', undefined, undefined, undefined, () => navigate("/User/Account")),
    getItem('Change password', '12', undefined, undefined, undefined, () => navigate("/User/ChangePassword")),
  ]),
  getItem('Orders', '2', <AppstoreOutlined />, undefined, undefined, () => navigate("/User/Orders")),
  getItem('Sign Out', '3', <AppstoreOutlined />, undefined, undefined, () => SignOut())
];

const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        return func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(items);
  const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
  const navigate = useNavigate(); // Sử dụng hook useNavigate để chuyển hướng

  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  const handleItemClick = (key) => {
    console.log('Item clicked:', key); // Xử lý sự kiện khi một mục được chọn
  };

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['231']}
      openKeys={stateOpenKeys}
      onOpenChange={onOpenChange}
      style={{ width: 256, backgroundColor:"inherit" }}
      items={items}
    />
  );
};

export default UserSidebar;
