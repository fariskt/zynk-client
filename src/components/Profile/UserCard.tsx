"use client";

import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import UserCardSkelton from "../../utils/SkeltonUi/UserCardSkelton";
import { useUserConnections } from "@/src/hooks/useUser";
import useAuthStore from "../../store/useAuthStore";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { User } from "@/src/types";

const UserCard = ({ connectionType,}: {  connectionType: "followers" | "following"}) => {
  const pathname = usePathname();
  const params = useParams();
  const { user } = useAuthStore();

  const slug = params?.slug as string;
  const friendId = slug?.split("-").pop();
  const userID = pathname.startsWith("/members") ? friendId || "" : user?._id || "";

  const [page, setPage] = useState(1);
  const limit = 4;

  const { data: connectionsData, isLoading } = useUserConnections( userID, limit, page);

  const disableNextPage = page * limit >= connectionsData?.[connectionType]?.length;

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  const handleNext = () => {
    if (!disableNextPage) {
      setPage((prev) => prev + 1);
    }
  };
  const slugify = (fullname: string) => fullname.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full flex flex-col items-center p-4 gap-6 max-w-7xl mx-auto">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading && <UserCardSkelton />}

        {connectionsData?.[connectionType].length > 0 ? (
          connectionsData?.[connectionType]?.map((person: User) => (
            <div
              key={person._id}
              className="w-full max-w-[250px] bg-white dark:bg-gray-800 border dark:border-gray-600 shadow-lg rounded-lg p-6"
            >
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={person.profilePicture || "/person-demo.jpg"}
                  className="h-20 w-20 border-4 border-gray-300 rounded-full object-cover"
                  alt="Profile"
                />
                <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center">
                  {person.fullname || "Username"}
                </h5>

                {/* Stats */}
                <div className="flex justify-around w-full text-center">
                  <div>
                    <h5 className="text-sm text-gray-600 dark:text-gray-400">
                      Posts
                    </h5>
                    <p className="text-xl font-bold text-blue-500">
                      {person.postCount || 0}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm text-gray-600 dark:text-gray-400">
                      Followers
                    </h5>
                    <p className="text-xl font-bold text-blue-500">
                      {person.followers.length || 0}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm text-gray-600 dark:text-gray-400">
                      Following
                    </h5>
                    <p className="text-xl font-bold text-blue-500">
                      {person.following.length || 0}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between gap-4 w-full mt-5">
                  <div className="w-5/6 py-2 text-center text-sm bg-gray-200 dark:bg-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300">
                  <Link href={person._id === user?._id ? "/profile" : `/members/${slugify(person.fullname)}-${person._id}`}>
                  <button className="w-full">
                    View Profile
                  </button>
                  </Link>
                  </div>
                  <button className="py-2 text-sm rounded-md dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300">
                    <BsThreeDots />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-56 dark:text-white items-center justify-center w-full col-span-full">
            <h3 className="text-lg font-semibold">No {connectionType} found</h3>
          </div>
        )}
      </div>

      {connectionsData?.[connectionType].length > 0 && (
        <div className="mt-6 flex gap-2 justify-center items-center">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-all duration-300 text-white shadow ${
              page === 1
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Prev
          </button>

          <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-gray-800 dark:text-gray-200 shadow-sm">
            Page {page}
          </span>

          <button
            onClick={handleNext}
            disabled={disableNextPage}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-all duration-300 text-white shadow ${
              disableNextPage
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            }`}
          >
            Next
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
