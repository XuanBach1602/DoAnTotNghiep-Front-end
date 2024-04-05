import "./Account.css";
import { Button, Form, Input, Select, Space, DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { useUser } from "../../../UserContext";
import { useState } from "react";
const Account = () => {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState({ ...user });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState();
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Lấy file từ sự kiện onchange
    if (file) {
      setSelectedFile(file); // Lưu trữ file vào state
      const reader = new FileReader(); // Tạo FileReader object để đọc file
      reader.onloadend = () => {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          avatarUrl: reader.result, // Đặt đường dẫn ảnh mới cho userInfo
        }));
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng Data URL
    }
  };
  const setName = (name) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      name: name,
    }));
  };
  const setAddress = (address) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      address: address,
    }));
  };
  const setEmail = (email) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      email: email,
    }));
  };
  const setPhoneNumber = (phoneNumber) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      phoneNumber: phoneNumber,
    }));
  };
  const setDateOfBirth = (dateOfBirth) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      dateOfBirth: dateOfBirth,
    }));
  };
  const save = () => {
    let hasError = false;
    const errorMessages = [];

    // Kiểm tra từng trường trong userInfo
    for (const key in userInfo) {
      if (userInfo.hasOwnProperty(key)) {
        if(key == "avatar") continue;
        if (userInfo[key] === null || userInfo[key] === undefined) {
          errorMessages.push(`${key} is null or undefined`);
          hasError = true;
        }
      }
    }

    // Nếu có lỗi, hiển thị thông báo lỗi
    if (hasError) {
      setError("Please fill full in form");
      console.log(userInfo);
    } else {
      setError("")
      console.log(userInfo);
    }
  };

  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";
  const { TextArea } = Input;
  return (
    <div style={{ margin: "20px" }}>
      <div className="account-navbar">
        <div className="account-title" style={{ fontSize: "20px" }}>
          My Profile
        </div>
        <div>Manage profile information for account security</div>
        <hr />
      </div>
      <div className="account-main">
        <div className="account-main-left">
          <div>
            <label className="account-label" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              value={userInfo.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="account-label" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              value={userInfo.name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="account-label" htmlFor="phoneNumber">
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              value={userInfo.phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="account-label" htmlFor="address">
              Address
            </label>
            <TextArea
              id="address"
              value={userInfo.address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="account-label" htmlFor="dateOfBirth">
              Date of Birth
            </label>
            <DatePicker
              id="dateOfBirth"
              value={
                userInfo?.dateOfBirth
                  ? dayjs(userInfo.dateOfBirth, dateFormat)
                  : dayjs("2024-04-04", dateFormat)
              }
              onChange={(date, dateString) => setDateOfBirth(dateString)}
              format={dateFormat}
              disabledDate={(current) =>
                current &&
                (
                  current > dayjs("2024-04-31", dateFormat))
              }
            />
          </div>
          <span style={{ color: "red" }}>{error}</span>
          <div onClick={() => save()} style={{ justifyContent: "center" }}>
            <Button type="primary">Save</Button>
          </div>
        </div>

        <div className="account-main-right">
          <img
            src={userInfo.avatarUrl}
            className="account-avatar"
            alt="user avatar"
          />
          <input
            type="file"
            id="upload-avatar"
            style={{ display: "none" }}
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
          />

          {/* Nút "Choose picture" */}
          <Button
            type="primary"
            onClick={() => {
              document.getElementById("upload-avatar").click(); // Kích hoạt sự kiện click cho input type file ẩn
            }}
          >
            Choose picture
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Account;