"use client";

import React, { useEffect, useId } from "react";
import PostCard from "../components/PostDetails/PostCard";
import AxiosInstance from "../lib/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../components/store/useAuthStore";
import SuggestedFreinds from "../components/Profile/SuggestedFreinds";

const fetchAllUsers = async () => {
  const res = await AxiosInstance.get("/user/users");
  return res.data;
};
export default function Home() {
  const { user: loggedUser, setUser, fetchUser } = useAuthStore();
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fetchUsers"],
    queryFn: fetchAllUsers,
  });

  return (
    <div className="flex mt-10 justify-between dark:bg-gray-800">
      <div className="space-y-5">
        <div className="flex flex-col items-center bg-white dark:bg-gray-900 dark:border-0 dark:text-white shadow-lg border w-[230px] h-[280px] rounded-md p-4">
          <div className="bg-gray-600 w-full flex justify-center py-3 rounded-t-2xl">
            <img
              src={loggedUser?.profilePicture || "/person-demo.jpg"}
              className="h-20 w-20 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
              alt="Profile"
            />
          </div>
          <h2 className="text-lg font-semibold text-center mt-3">
            {loggedUser?.fullname || "User Name"}
          </h2>
          <div className="flex justify-between w-full px-4 mt-6">
            <div className="text-center">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm">
                Posts
              </h3>
              <p className="text-lg font-bold">0</p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm">
                Followers
              </h3>
              <p className="text-lg font-bold">
                {loggedUser?.followers?.length || 0}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-600 dark:text-gray-400 text-sm">
                Following
              </h3>
              <p className="text-lg font-bold">
                {loggedUser?.following?.length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 dark:border-0 dark:text-white  shadow border w-[230px] h-[300px] rounded-md"></div>
      </div>
      <div>
        <div className="bg-white dark:bg-gray-900 dark:text-white dark:border-0 flex items-center shadow border p-4 gap-8 max-w-xl rounded-md">
          <button>Recent</button>
          <button>Following</button>
        </div>
        <div>
          <PostCard />
        </div>
      </div>
      <div>
        {!isLoading && (
          <SuggestedFreinds
            users={users}
            isLoading={isLoading}
            loggedUser={loggedUser}
          />
        )}
        <div className="bg-white dark:bg-gray-900 dark:text-white dark:border-0 shadow border w-[260px] h-[300px] rounded-md"></div>
      </div>
    </div>
  );
}
