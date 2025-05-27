"use client"

import { useMutation, useQuery } from "@tanstack/react-query";
import AxiosInstance from "@/src/lib/axiosInstance";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("success mutation", data);
      setUser(data?.user);

      // Client-side checks
      if (typeof window !== "undefined") {
        toast.success("Login Successful");
        localStorage.setItem("isLogin", "true");
        setTimeout(() => {
          router.replace("/");
        }, 1000);
      }
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
      if(typeof window !== "undefined"){
        localStorage.removeItem("isLogin")
      }
    }
  });
};

export const useFetchLoggedUser = ()=> {
  return useQuery({
    queryKey: ["loggedUser"],
    queryFn: async()=> {
      const { data } = await AxiosInstance.get("/auth/me");
      return data.user
      
    },
  })
}