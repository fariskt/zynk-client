import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://zynk-server.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === "/login";
      if (!isLoginPage) {
        window.location.href = "/login";
      }
      localStorage.removeItem("isLogin")
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
