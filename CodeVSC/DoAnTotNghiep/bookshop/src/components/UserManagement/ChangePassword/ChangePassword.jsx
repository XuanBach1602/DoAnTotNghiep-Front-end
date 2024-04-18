import { Button, Form, Input, Select, Space, DatePicker } from "antd";
import { useState } from "react";
import { toast } from "react-toastify";
import { putAsync } from "../../../Apis/axios";
import "./ChangePassword.css";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const save = async () => {
        if(newPassword === "" || currentPassword === "" || confirmPassword === "" ){
            setError("Please fill full in form");
        }
        else if (newPassword !== confirmPassword) {
            setError("Password and Confirmation Password must be same");
        }
        else {
            try {
                var res = await putAsync(`/api/User/ChangePassword?password=${currentPassword}&newPassword=${newPassword}`);
                setError("");
                toast.success("Change password successfully", {
                    autoClose: 1000,
                  });
              } catch (error) {
                setError(error.response.data)
              }
        }

    }
  return (
    <div>
      <div className="change-password-main">
        <h2>Change Password</h2>
        <div>
          <label className="account-label" htmlFor="password">
          Current password
          </label>
          <Input
            id="current-password"
            type="password"
            // value={userInfo.email}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="account-label" htmlFor="name">
            New password
          </label>
          <Input
            id="name"
            type="password"
            // value={userInfo.name}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="account-label" htmlFor="phoneNumber">
            Confirmation password
          </label>
          <Input
            id="phoneNumber"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="error">{error}</div>
        <div onClick={() => save()} style={{ justifyContent: "center" }}>
          <Button type="primary">Save</Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
