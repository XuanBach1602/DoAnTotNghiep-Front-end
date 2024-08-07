import React from "react";
import { useState, useEffect, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Input, Space } from "antd";
import {
  HomeTwoTone,
  ShoppingCartOutlined,
  SmileTwoTone,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useUser } from "../UserContext";
import "./layout.css";
import { getAsync } from "../Apis/axios";
const { Search } = Input;

const MainLayout = () => {
  const [searchText, setSearchText] = useState("");
  const { user, cartNumber, fetchCartData } = useUser();
  const [cartCount, setCartCount] = useState(cartNumber);
  const navigate = useNavigate();
  const onSearch = (e) => {
    setSearchText(e);
    console.log(searchText);
  };

  // const fetchCartData = async () => {
  //   try {
  //     var res = await getAsync("/api/CartItem/GetAllByUserId");
  //     setCartCount(res.length);
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   fetchCartData();
  // }, []);
  return (
    <div className="main-container">
      <nav className="navbar-container">
        <div style={{ color: "#33B2FF" }} className="shop-title">
          Bách Sh<span style={{ color: "#FFCE33" }}>o</span>p
        </div>
        <div className="search-container">
          <Search
            className="search-input"
            style={{ height: "40px" }}
            size="large"
            placeholder="Fill search text"
            onSearch={onSearch}
            enterButton
            defaultValue={searchText}
          />
        </div>
        <div className="navbar-icon-list">
          <div className="homepage" onClick={() => navigate("/")}>
            <HomeTwoTone style={{ fontSize: "30px" }} /> <span>Home Page</span>
          </div>
          <div className="homepage" onClick={() => navigate("/User")}>
            <SmileTwoTone style={{ fontSize: "30px" }}/> <span>Account</span>
          </div>
          <div
            className="homepage"
            style={{ position: "relative", display: "inline-block" }}
            onClick={() => navigate("/Cart")}
          >
            <ShoppingCartOutlined
              style={{ fontSize: "30px", color: "#33B2FF" }}
            />
            <span
              style={{
                position: "absolute",
                top: "-10px",
                right: "-10px",
                background: "red",
                borderRadius: "100%",
                padding: "2px",
                color: "white",
                fontSize: "12px",
              }}
            >
              {cartNumber}
            </span>
          </div>
        </div>
      </nav>
      <div className="page-container">
        <Outlet context={[searchText,fetchCartData]} />
        <footer className="footer">
          <hr />
          <div className="company-title">Công ty TNHH Xuân Bách</div>
          <div className="company-address">
            Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội
          </div>
          <div>Hotline: 0981963789</div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
