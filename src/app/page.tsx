"use client";

import React, { useState } from "react";
import PostCard from "../components/PostDetails/PostCard";
import AxiosInstance from "../lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../store/useAuthStore";
import SuggestedFreinds from "../components/Profile/SuggestedFreinds";
import UploadPost from "../components/UploadPost/UploadPost";

const fetchAllUsers = async () => {
  const res = await AxiosInstance.get("/user/users?limit=10");
  return res.data;
};

export default function Home() {
  const [showUpload, setShowUplaod] = useState<boolean>(false);
  const { user: loggedUser } = useAuthStore();
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fetchUsers"],
    queryFn: fetchAllUsers,
  });

  return (
    <>
    <div className="flex mt-24 justify-between ml-36 dark:bg-gray-950">
      {showUpload && <UploadPost onClose={() => setShowUplaod(false)} />}
      <div className="space-y-5 ml-44">
        <PostCard />
      </div>
      <div >
        {!isLoading && (
          <SuggestedFreinds
          users={users}
          isLoading={isLoading}
          />
        )}
      </div>
    </div>
        </>
  );
}
