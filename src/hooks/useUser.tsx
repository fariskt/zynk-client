import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "../lib/axiosInstance";
import useAuthStore from "../store/useAuthStore";
import { AxiosError, AxiosResponse } from "axios";
import { User } from "../types";

export const useUserConnections = (userId: string, limit = 10, page = 1) => {
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
    enabled: !!userId
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
    enabled: !!userId,
  });
};

export const useSendFollowReq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await AxiosInstance.post("/user/follow-request", { userId });
      return res.data;
    },

    onMutate: async (userId: string) => {
      // Cancel any ongoing queries for the logged-in user
      await queryClient.cancelQueries({ queryKey: ["loggedUser"] });

      // Get the current cached data
      const previousUserData = queryClient.getQueryData(["loggedUser"]);

      // Optimistically update the cache
      queryClient.setQueryData(["loggedUser"], (oldData: User) => {
        if (!oldData) return oldData;

        const isFollowing = oldData.following.includes(userId);

        return {
          ...oldData,
          following: isFollowing
            ? oldData.following.filter((id: string) => id !== userId) // Unfollow
            : [...oldData.following, userId], // Follow
        };
      });

      // Return context for rollback on error
      return { previousUserData };
    },

    onError: (_error, _userId, context) => {
      // Rollback to previous data on error
      if (context?.previousUserData) {
        queryClient.setQueryData(["loggedUser"], context.previousUserData);
      }
    },

    onSettled: () => {
      // Refetch the logged user data to sync with backend
      queryClient.invalidateQueries({ queryKey: ["loggedUser"] });
    },
  });
};

type UpdatePhotosPayload = {
  profilePicture?: File;
  coverPhoto?: File;
};

type UpdatePhotosResponse = {
  success: boolean;
  message: string;
  updatedUser?: {
    profilePicture?: string;
    coverPhoto?: string;
  };
};

export const useUpdateProfilePhotos = () => {
const{fetchUser} = useAuthStore()
  return useMutation<UpdatePhotosResponse, AxiosError, UpdatePhotosPayload>({
    mutationFn: async ({ profilePicture, coverPhoto }) => {
      const formData = new FormData();

      if (profilePicture) formData.append("profilePicture", profilePicture);
      if (coverPhoto) formData.append("coverPhoto", coverPhoto);

      const res: AxiosResponse<UpdatePhotosResponse> = await AxiosInstance.post(
        "/user/updateProfilePicture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data;
    },
    onSuccess: () => {
      fetchUser()
    },
    onError: (error) => {
      console.error("Error uploading photo:", error.response?.data || error.message);
    },
  });
};