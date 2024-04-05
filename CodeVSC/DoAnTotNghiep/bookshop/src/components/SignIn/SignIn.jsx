import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./SignIn.css";
import { Input, Form, Button } from "antd";
import { useUser } from "../../UserContext";
import { toast } from "react-toastify";
import { postAsync } from "../../Apis/axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState("");
  const {user,setUser, setIsAuthenticated} = useUser();
  const navigate = useNavigate();
  const Post = async () => {
    var isValid = (email !== "") && (password !== "");
    if (!isValid) {
      setValidation("Please fill in form");
    } else {
      try {
        const data = {
          email: email,
          password: password
        }
        const res = await postAsync("/api/Auth/SignIn",data);
        setIsAuthenticated(true);
        console.log(res);
        setUser(res.userInfo);
        Cookies.set("token", res.token, { expires: 7 }); // Token expires in 7 days
        Cookies.set("user", JSON.stringify(res.userInfo), { expires: 7 });
        setValidation("");
        toast.success("Sign in successfully!", {
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } catch (error) {
        setValidation(error.response.data.errMsg);
      }
    }
  };
    
  return (
    <div className="signin-page">
      <div className="signin-main">
        <div className="signin-form">
          <h2 style={{ marginTop: "30px" }}>Sign In</h2>
          <Form>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please fill your email",
                },
              ]}
            >
              <Input
                className="signin-data-input"
                placeholder="Fill your mail"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please fill password",
                },
              ]}
            >
              <Input
                type="password"
                className="signin-data-input"
                placeholder="Fill your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
          </Form>
          <span className="validation-all-signin" style={{ color: "#FF0F00" }}>
            {validation}
          </span>
          <Button type="primary" onClick={() => Post()}>
            Log In
          </Button>
          <p className="signIn">
            Do not have an account ?{" "}
            <a href="/signup" style={{ textDecoration: "none" }}>
              Sign Up
            </a>
          </p>
        </div>
        <div className="description">
          <h2 style={{ color: "white" }}>Glad to see you</h2>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
