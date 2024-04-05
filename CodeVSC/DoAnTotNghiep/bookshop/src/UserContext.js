import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const token = Cookies.get("token");
  const userInfo = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const [user, setUser] = useState(userInfo);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
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
