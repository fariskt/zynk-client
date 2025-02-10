"use client";

import UserPostCard from "@/src/components/PostDetails/UserPostCard";
import Activity from "@/src/components/Profile/Activity";
import useAuthStore from "@/src/components/store/useAuthStore";
import { BsPersonStanding } from "react-icons/bs";
import { FaBirthdayCake } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { RiUserFill } from "react-icons/ri";

export default function ProfilePage() {
  const {user} = useAuthStore()
  return (
    <div>
      <div className="flex justify-around gap-4">
        <div className="flex flex-col bg-white dark:bg-gray-900 dark:text-gray-200 gap-4 shadow border dark:border-0 w-3/6 mt-5 rounded-md h-fit pb-4">
          <h3 className="text-left my-4 mx-4 pb-2 border-b dark:border-b-gray-500 font-semibold text-gray-700 dark:text-gray-200">
            Personal info
          </h3>
          <div className="ml-4">
            <div className="flex gap-2 items-center">
              <span>
                <RiUserFill />
              </span>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">About me</h5>
            </div>
            <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">
              {user?.bio}
            </p>
          </div>
          <div className="ml-4">
            <div className="flex gap-2 items-center">
              <span>
                <IoIosMail />
              </span>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Email</h5>
            </div>
            <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
          <div className="ml-4">
            <div className="flex gap-2 items-center">
              <span>
                <FaBirthdayCake />
              </span>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Birthday</h5>
            </div>
            <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">
            {user?.birthday && new Date(user.birthday).toISOString().split("T")[0]}
            </p>
          </div>
          <div className="ml-4">
            <div className="flex gap-2 items-center">
              <span>
                <BsPersonStanding />
              </span>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Gender</h5>
            </div>
            <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">{user?.gender}</p>
          </div>
          <div className="ml-4">
            <div className="flex gap-2 items-center">
              <span>
                <FaGlobe />
              </span>
              <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Country</h5>
            </div>
            <p className="text-sm ml-6 text-gray-600 dark:text-gray-400">{user?.country}</p>
          </div>
        </div>
        <UserPostCard />
        <Activity />
      </div>
    </div>
  );
}
