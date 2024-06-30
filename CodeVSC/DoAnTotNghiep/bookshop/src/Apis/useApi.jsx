import axios from 'axios';
import Cookies from 'js-cookie';
import { useLoading } from '../LoadingContext';

const getToken = () => {
  const token = Cookies.get("token");
  return token;
};

const useApi = () => {
  const { setIsLoading } = useLoading();
  const host = process.env.REACT_APP_API_HOST || 'https://localhost:7239';
  
  const apiCall = async (method, url, data = {}, config = {}) => {
    try {
      // setIsLoading(true);
      const token = getToken();
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      config.withCredentials = true;
      const fullUrl = `${host}${url}`;
      
      let response;
      if (method === 'get' || method === 'delete') {
        const queryString = new URLSearchParams(data).toString().replaceAll("null", "").replaceAll("undefined", "");
        response = await axios[method](`${fullUrl}${queryString ? `?${queryString}` : ''}`, config);
      } else {
        response = await axios[method](fullUrl, data, config);
      }
      
      // setIsLoading(false);
      return response.data;
    } catch (error) {
      // setIsLoading(false);
      throw error;
    }
  };

  const getAsync = (url, data, config) => apiCall('get', url, data, config);
  const postAsync = (url, data, config) => apiCall('post', url, data, config);
  const putAsync = (url, data, config) => apiCall('put', url, data, config);
  const deleteAsync = (url, data, config) => apiCall('delete', url, data, config);

  return { getAsync, postAsync, putAsync, deleteAsync };
};

export default useApi;