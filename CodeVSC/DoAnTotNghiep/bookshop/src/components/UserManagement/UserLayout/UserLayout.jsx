import { Outlet } from "react-router-dom";
import UserSidebar from "../UserSidebar/UserSidebar";

const UserLayout = () => {
    return (
        <div style={{ display: "flex", height: "100%" }}>
        <UserSidebar />
        <div style={{ backgroundColor: "white", height: "100%", flexGrow: 1,borderTop: "1px solid #929A9A", paddingTop:"10px"}}>
          <Outlet />
        </div>
      </div>
      
    )
}

export default UserLayout;