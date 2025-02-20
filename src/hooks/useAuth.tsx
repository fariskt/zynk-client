import { useMutation } from "@tanstack/react-query";
import AxiosInstance from "@/src/lib/axiosInstance";
import useAuthStore from "../store/useAuthStore";

const loginUser = async (userData: { email: string; password: string }) => {
  const response = await AxiosInstance.post("/auth/login", userData);
  console.log(response.data);
  
  return response.data;
};


const registerUser = async (userData: { fullname: string; email: string; password: string }) => {
  const response = await AxiosInstance.post("/auth/register", userData);  
  return response.data;
};

const logoutUser = async () => {
  await AxiosInstance.post("/auth/logout");  
  return "Logged out successfully";
};


export const useLoginMutation = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: loginUser, 
    onSuccess: (data) => {
      console.log(data);
      setUser(data?.user); 
    }
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: registerUser
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem("isLogin")
    }
  });
};
