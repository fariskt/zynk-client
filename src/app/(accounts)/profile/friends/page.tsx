"use client"

import UserCard from "@/src/components/Profile/UserCard";
import React, { useState } from "react";

const Page = () => {
  const [connectionType, setConnectionType] = useState<"followers" | "following">("following");

  const handleChange=(event: React.ChangeEvent<HTMLSelectElement>)=> {
    setConnectionType(event.target.value as "followers" | "following")
  }

  return (
    <div className="mt-10 pb-5">
      <div className="flex justify-between bg-white dark:bg-gray-900 dark:text-white items-center shadow border dark:border-0 py-3 px-6 rounded-md">
        <div className="space-x-5">
          <button>Freinds</button>
        </div>
        <div className="flex flex-row gap-4">
          <input
            type="text"
            placeholder="Search friends"
            className="border rounded-sm pl-2 py-1 outline-none dark:bg-gray-600"
          />
          <select name="" id="" className="border rounded-md dark:bg-gray-600" value={connectionType} onChange={handleChange}>
            <option value="followers">Followers</option>
            <option value="following">Following</option>
          </select>
        </div>
      </div>
      <div className="bg-white flex dark:bg-gray-900">
        <UserCard connectionType={connectionType} />
      </div>
    </div>
  );
};

export default Page;
