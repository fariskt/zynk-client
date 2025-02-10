"use client";

import AxiosInstance from "@/src/lib/axiosInstance";
import React from "react";
import { BsThreeDots } from "react-icons/bs";
import useAuthStore from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import UserCardSkelton from "../../utils/SkeltonUi/UserCardSkelton";

const fetchUserConnections = async (userId: string, type: string) => {
  const res = await AxiosInstance.get(`/user/${type}/${userId}`);
  return res.data;
};

const UserCard = ({ connectionType}: { connectionType: "followers" | "following"}) => {
  const { user } = useAuthStore();
  const userId = user?._id || "";

  const { data: connectionsData, isLoading  } = useQuery({
    queryKey: ["fetchConnections", userId, connectionType],
    queryFn: () => fetchUserConnections(userId, connectionType),
    enabled: !!userId,
  });

  return (
    <div className="w-full flex flex-row p-4 flex-wrap gap-4 max-w-4xl">
      {isLoading && <UserCardSkelton/>}
      {connectionsData?.[connectionType]?.map(
        (person: {
          _id: string;
          fullname: string;
          profilePicture: string;
          postCount: number;
          followersCount: number;
          followingCount: number;
        }) => (
          <div className="w-[250px] max-h-[350px] bg-white dark:bg-gray-800 border dark:border-gray-500 shadow rounded-lg p-6" key={person._id}>
            <div
              className="w-full flex flex-col items-center space-y-4">
              <div className="flex flex-col items-center">
                <img
                  src={person.profilePicture || "/person-demo.jpg"}
                  className="h-20 w-20 border-4 border-gray-200 rounded-full"
                  alt="Profile"
                />
                <h5 className="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {person.fullname || "Username"}
                </h5>
              </div>

              <div className="flex justify-around w-full">
                <div className="text-center">
                  <h5 className="text-sm text-gray-600 dark:text-gray-100">Posts</h5>
                  <p className="text-xl font-bold text-blue-500">
                    {person.postCount || 0}
                  </p>
                </div>
                <div className="text-center">
                  <h5 className="text-sm text-gray-600 dark:text-gray-100">Followers</h5>
                  <p className="text-xl font-bold text-blue-500">
                    {person.followersCount || 0}
                  </p>
                </div>
                <div className="text-center">
                  <h5 className="text-sm text-gray-600 dark:text-gray-100">Following</h5>
                  <p className="text-xl font-bold text-blue-500">
                    {person.followingCount || 0}
                  </p>
                </div>
              </div>

              <div className="flex justify-between gap-4 w-full mt-5">
                <button className="w-5/6 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300">
                  View Profile
                </button>
                <button className="py-2 text-sm rounded-md transition duration-300 dark:text-white">
                  <BsThreeDots />
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default UserCard;
