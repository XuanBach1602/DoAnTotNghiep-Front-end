import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Spin } from 'antd';

// Host của bạn
const host = 'https://localhost:44324';

const getToken = () => {
  const token = Cookies.get("token");
  return token;
};

const ApiCaller = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Hàm GET
   const getAsync = async (url, data = {}, config = {}) => {
    try {
      setIsLoading(true); // Bắt đầu hiển thị spin
      const token = getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      config.withCredentials = true;
      const queryString = new URLSearchParams(data).toString().replaceAll("null","").replaceAll("undefined","");
      const fullUrl = `${host}${url}${queryString ? `?${queryString}` : ''}`;

      const response = await axios.get(fullUrl, config);
      setIsLoading(false); // Kết thúc hiển thị spin
      return response.data;
    } catch (error) {
      setIsLoading(false); // Kết thúc hiển thị spin
      throw error;
    }
  };

  // Hàm POST
  const postAsync = async (url, data, config = {}) => {
    try {
      setIsLoading(true); // Bắt đầu hiển thị spin
      const token = getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      config.withCredentials = true;
      const response = await axios.post(`${host}${url}`, data, config);
      setIsLoading(false); // Kết thúc hiển thị spin
      return response.data;
    } catch (error) {
      setIsLoading(false); // Kết thúc hiển thị spin
      throw error;
    }
  };

  // Hàm PUT
  const putAsync = async (url, data, config = {}) => {
    try {
      setIsLoading(true); // Bắt đầu hiển thị spin
      const token = getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      config.withCredentials = true;
      const response = await axios.put(`${host}${url}`, data, config);
      setIsLoading(false); // Kết thúc hiển thị spin
      return response.data;
    } catch (error) {
      setIsLoading(false); // Kết thúc hiển thị spin
      throw error;
    }
  };

  // Hàm DELETE
  const deleteAsync = async (url, config = {}) => {
    try {
      setIsLoading(true); // Bắt đầu hiển thị spin
      const token = getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      config.withCredentials = true;
      const response = await axios.delete(`${host}${url}`, config);
      setIsLoading(false); // Kết thúc hiển thị spin
      return response.data;
    } catch (error) {
      setIsLoading(false); // Kết thúc hiển thị spin
      throw error;
    }
  };

  return (
    <div>
      {isLoading && <Spin />} {/* Hiển thị Spin nếu isLoading là true */}
      {/* Nơi bạn gọi các hàm API */}
    </div>
  );
};

export default ApiCaller;
