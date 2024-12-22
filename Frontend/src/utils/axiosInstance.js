import axios from 'axios';

const accessToken = localStorage.getItem('accessToken');

const axiosInstance = axios.create({
  baseURL: '/api/v1',
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  withCredentials: true, // If cookies are needed
});

export default axiosInstance;
