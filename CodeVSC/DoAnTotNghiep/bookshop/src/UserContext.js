import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { getAsync } from './Apis/axios';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const token = Cookies.get("token");
  const userInfo = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const [user, setUser] = useState(userInfo);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const fetchUserData = async () => {
    try {
      var res = await getAsync("/api/User/Detail");
      setUser(res);
      console.log(res);
    } catch (error) {}
  }

  // useEffect(() => {
  //   fetchUserData();
  // },[])
  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, fetchUserData }}>
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
