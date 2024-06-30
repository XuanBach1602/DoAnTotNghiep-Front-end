import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useUser } from "../UserContext";

const Authentication = () => {
  // Gọi useOutletContext bên ngoài câu lệnh try-catch
  const context = useOutletContext();
  const { isAuthenticated } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectPath", location.pathname);
      navigate("/signin");
    }
  }, [isAuthenticated, location, navigate]);

  return (
    <Outlet context={context} />
  );
};

export default Authentication;