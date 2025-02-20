import { useMutation, useQuery } from "@tanstack/react-query";
import AxiosInstance from "../lib/axiosInstance";

export const useUserConnections = (userId:string , limit = 10, page = 1) => {
  return useQuery({
    queryKey: ["fetchConnections", userId, limit, page],
    queryFn: async () => {
      if (!userId) return { followers: [], following: [] };
      const [followersRes, followingRes] = await Promise.all([
        AxiosInstance.get(
          `/user/followers/${userId}?limit=${limit}&page=${page}`
        ),
        AxiosInstance.get(
          `/user/following/${userId}?limit=${limit}&page=${page}`
        ),
      ]);
      return {
        followers: followersRes.data.followers,
        following: followingRes.data.following,
      };
    },
    enabled: !!userId,
  });
};

export const useFetchUserActivity = (userId: string) => {
  return useQuery({
    queryKey: ["fetchRecentActivities", userId],
    queryFn: async () => {
      const res = await AxiosInstance.get(`/user/recent-activities/${userId}`);
      return res.data;
    },
  });
};

export const useSearchUsers = (searchValue: string) => {
  return useQuery({
    queryKey: ["fetchUserBySearch", searchValue],
    queryFn: async () => {
      const res = await AxiosInstance(
        `/user/users?page=1&limit=10&search=${searchValue}`
      );
      return res.data;
    },
    enabled: !!searchValue,
  });
};

export const useFetchUserById = (userId: string) => {
  return useQuery({
    queryKey: ["fetchUserById", userId],
    queryFn: async () => {
      const res = await AxiosInstance.get(`/user/${userId}`);
      return res.data;
    },
    enabled: !!userId, // Only run query when userId exists
  });
};

export const useSendFolllowReq = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await AxiosInstance.post("/user/follow-request", { userId });
      return res.data;
    },
  });
};
