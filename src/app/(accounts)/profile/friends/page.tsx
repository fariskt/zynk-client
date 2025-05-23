"use client"

import UserCard from "@/src/components/Profile/UserCard";
import React, { useState } from "react";

const Page = () => {
  const [connectionType, setConnectionType] = useState<"followers" | "following">("following");

  const handleChange=(event: React.ChangeEvent<HTMLSelectElement>)=> {
    setConnectionType(event.target.value as "followers" | "following")
  }

  return (
    <div className="mt-10 pb-5 max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between bg-white dark:bg-gray-900 dark:text-white items-center shadow-md border dark:border-0 py-4 px-6 rounded-md gap-4">
        <div className="space-x-5 text-lg font-semibold">
          <button className="text-blue-600 dark:text-blue-400">
            Friends /{" "}
            {connectionType.charAt(0).toUpperCase() + connectionType.slice(1)}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search friends"
            className=" rounded-md pl-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-blue-500 transition w-full md:w-auto"
          />

          <select
            value={connectionType}
            onChange={handleChange}
            className=" rounded-md py-2 px-3 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition w-full md:w-auto"
          >
            <option value="followers">Followers</option>
            <option value="following">Following</option>
          </select>
        </div>
      </div>

      <div className="shadow-md mt-5 min-h-80 flex justify-center items-center bg-white dark:bg-gray-900 rounded-md p-4">
        <UserCard connectionType={connectionType} />
      </div>
    </div>
  );
};

export default Page;
