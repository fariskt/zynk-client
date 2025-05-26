import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
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
      if(typeof window !== "undefined"){
        localStorage.removeItem("isLogin")
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
