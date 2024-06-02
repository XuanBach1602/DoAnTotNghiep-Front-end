import axios from 'axios';
import Cookies from 'js-cookie';

// Host của bạn
const host = 'https://localhost:7239';

const getToken = () => {
  const token = Cookies.get("token");
  return token;
};

// Hàm GET
export const getAsync = async (url, data = {}, config = {}) => {
  try {
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
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Hàm POST
export const postAsync = async (url, data, config = {}) => {
  try {
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    config.withCredentials = true; // Thêm vào đây
    const response = await axios.post(`${host}${url}`, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm PUT
export const putAsync = async (url, data, config = {}) => {
  try {
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    config.withCredentials = true; // Thêm vào đây
    const response = await axios.put(`${host}${url}`, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm DELETE
export const deleteAsync = async (url, config = {}) => {
  try {
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    config.withCredentials = true; // Thêm vào đây
    const response = await axios.delete(`${host}${url}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
