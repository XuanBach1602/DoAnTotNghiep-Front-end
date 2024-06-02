import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { toast } from "react-toastify";
import {
    Button,
    Modal,
    Input,
    Space,
    Table,
    Select,
    message,
    Popconfirm,
    Upload,
    Image,
  } from "antd";
const { Search } = Input;
const { Option } = Select;
const Authentication = () => {
    
    const { isAuthenticated } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if(!isAuthenticated){
            localStorage.setItem("redirectPath", location.pathname);
            navigate("/signin");
        }
    },[location])
    return(
        <Outlet />  
    )
}

export default Authentication;