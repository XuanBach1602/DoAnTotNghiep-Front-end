import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input, Form, Button } from "antd";
import { toast } from "react-toastify";
import { postAsync } from "../../Apis/axios";
import "./SignUp.css";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordComfirm, setComfirmPassword] = useState("");
  const [isValidInput, setIsValidInput] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (input) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const checkEmptyInput = () => {
    let bool =
      phoneNumber !== "" &&
      name !== "" &&
      email !== "" &&
      password !== "" &&
      passwordComfirm !== "" &&
      passwordComfirm !== "";
    setIsValidInput(bool);
  };

  const SignUp = async () => {
    console.log(name, email, password, passwordComfirm, phoneNumber);
    if (!isValidInput) {
      setValidationMessage("Please fill in form");
      return;
    }

    if (password.length < 8) {
      setValidationMessage("Password must have atleast 8 characters");
      return;
    }

    if (password !== passwordComfirm) {
      setValidationMessage("Confirm password and password must be the same");
      return;
    }

    if (!validateEmail(email)) {
      setValidationMessage("Email is not in correct format");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      var config =  {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      var res = await postAsync("/api/auth/SignUp",formData, config);
      setValidationMessage("");
      toast.success("Create the account successfully",{
        autoClose:1000,
      });
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
      console.log(res);
    } catch (error) {
      console.log(error);
       setValidationMessage(error.response.data.join(","));
    }
  };

  useEffect(
    () => checkEmptyInput(),
    [name, email, password, passwordComfirm, phoneNumber]
  );
  return (
    <div className="signup-page">
      <div className="signup-main">
        <div className="signup-form">
          <h2>Sign Up</h2>
          <Form>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please fill your name!",
                },
              ]}
            >
              <Input
                className="data-input"
                placeholder="Fill your name"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
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
                className="data-input"
                placeholder="Fill your email!"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please fill password! (At least 8 characters)",
                },
              ]}
            >
              <Input
                type="password"
                className="data-input"
                placeholder="Fill password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Refill password",
                },
              ]}
            >
              <Input
                type="password"
                className="data-input"
                placeholder="Refill your password"
                onChange={(e) => setComfirmPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Please fill your phone number",
                },
              ]}
            >
              <Input
                type="number"
                className="data-input"
                placeholder="Fill your phone number"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Item>
          </Form>
          <span className="validation-all-signin" style={{ color: "#FF0F00" }}>
            {validationMessage}
          </span>
          <Button type="primary" onClick={() => SignUp()}>
            Create account
          </Button>
          <p className="signIn">
            Do you already have an account?{" "}
            <a href="/signin" style={{ textDecoration: "none" }}>
              Sign In
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

export default SignUp;
