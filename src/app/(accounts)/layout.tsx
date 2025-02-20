"use client";

import useAuthStore from "@/src/store/useAuthStore";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { LuPencilLine } from "react-icons/lu";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mt-24 mx-auto">
      <div className="w-full border dark:border-0 shadow-md rounded-xl">
        <div className="relative">
          <button className="absolute right-5 mt-8 bg-gray-200 border border-gray-400 dark:border-0 h-8 px-2 rounded-md">
            <LuPencilLine />
          </button>
          <img
            src="/cover-sample.jpg"
            className="w-full h-56 rounded-md object-cover"
            alt="Cover"
          />
        </div>

        <div className="flex justify-between px-6 py-4 bg-white dark:bg-gray-900 dark:text-white">
          <div className="flex items-center">
            <img
              src={
                user?.profilePicture ? user.profilePicture : "/person-demo.jpg"
              }
              className="rounded-full h-32 w-32 object-cover z-10 bg-white -mt-16 border-4 border-gray-900"
              alt="Profile"
            />
            <div className="ml-6">
              <h2 className="text-xl font-semibold">{user?.fullname}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Joined :{" "}
                {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <Link href="/profile/settings/edit-profile">
            <button className="ml-auto px-4 py-2 border dark:border-gray-400 rounded-md bg-gray-800 text-white hover:bg-gray-700">
              Edit Profile
            </button>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 dark:text-white flex items-center border-t border-t-gray-700 justify-between px-6 py-1">
          <div className="flex gap-8">
            <Link href="/profile">
              <h4 className="cursor-pointer">Posts</h4>
            </Link>
            <Link href="/profile/about">
              <h4 className="cursor-pointer">About</h4>
            </Link>
            <Link href="/profile/friends">
              <h4 className="cursor-pointer">Friends</h4>
            </Link>
          </div>
          <div className="flex gap-8 pt-2 pb-2">
            <div>
              <h4>Posts</h4>
              <p className="text-center dark:text-orange-100 text-blue-500">
                {user?.postCount || 0}
              </p>
            </div>
            <div>
              <h4>Followers</h4>
              <p className="text-center dark:text-orange-100 text-blue-500">
                {user?.followers?.length || 0}
              </p>
            </div>
            <div>
              <h4>Following</h4>
              <p className="text-center dark:text-orange-100 text-blue-500">
                {user?.following?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 ">{children}</div>
    </div>
  );
}
