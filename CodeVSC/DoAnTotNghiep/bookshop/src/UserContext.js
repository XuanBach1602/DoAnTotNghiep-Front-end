import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getAsync } from './Apis/axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const token = Cookies.get("token");
  const userInfo = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const [user, setUser] = useState(userInfo);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [cartNumber, setCartNumber] = useState(0);
  const fetchUserData = async () => {
    try {
      var res = await getAsync("/api/User/Detail");
      setUser(res);
      console.log(res);
    } catch (error) {}
  }

  const fetchCartData = async () => {
    try {
      var res = await getAsync("/api/CartItem/GetAllByUserId");
      setCartNumber(res.length);
    } catch (error) {
      setCartNumber(0);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCartData();
  },[])
  return (
    <UserContext.Provider value={{ user, setUser,cartNumber,fetchCartData, isAuthenticated, setIsAuthenticated, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };
