"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineDarkMode } from "react-icons/md";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiUser3Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { useLogoutMutation } from "@/src/hooks/useAuth";
import useAuthStore from "../store/useAuthStore";
import DarkModeToggle from "./DarkMode";
import Notification from "./Notification";

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const pathName = usePathname();
  const router = useRouter();

  const { mutate: logout } = useLogoutMutation();

  const isLogin = localStorage.getItem("isLogin") || "";

  const { user, fetchUser, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLogin) {
      fetchUser();
    }
  }, [isLogin]);

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    router.replace("/login");
  };

  useEffect(() => {
    setShowProfile(false);
  }, [pathName]);

  const getTheme = localStorage.getItem("theme");

  if (
    pathName === "/login" ||
    pathName === "/register" ||
    pathName === "/forgot-password" ||
    pathName === "/reset-password"
  ) {
    return null;
  }

  return (
    <nav className="fixed top-0 z-20 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-800 border left-0 w-full flex justify-between pl-3">
      <div className="flex flex-row items-center">
        <Link href="/">
          {getTheme === "light" ? (
            <img src="/white-logo.png" alt="Registration Image" className="h-16 w-28" />
          ) : (
            <img src="/black-logo.png" alt="Registration Image" className="h-16 w-28" />
          )}
        </Link>
        <div className="ml-24">
          <input
            type="text"
            placeholder="search here..."
            className="border border-[#b5b3b3] p-1 rounded-md w-[320px] dark:bg-gray-600 dark:border-gray-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-5 mr-5">
        <span className="text-2xl cursor-pointer">
          <DarkModeToggle />
        </span>
        <span className="text-2xl cursor-pointer" onClick={()=> {
          setShowNotification(!showNotification)
          setShowProfile(false)
          }}>
          <IoMdNotificationsOutline />
        </span>
        {isLogin !== "" && (
          <span
            className={
              isLoading ? "animate-pulse text-2xl" : "text-2xl cursor-pointer"
            }
            onClick={() => {
              setShowProfile(!showProfile)
              setShowNotification(false);
            }}
          >
            {user?.profilePicture ? (
              <img
                src={user?.profilePicture}
                alt="profile"
                className="w-8 h-8 border-2 border-gray-400 rounded-full"
              />
            ) : (
              <FaCircleUser />
            )}
          </span>
        )}
      </div>
      {showNotification && <Notification/>}
      {showProfile && (
        <div className="absolute right-3 mt-[70px] w-56 bg-white/30 backdrop-blur-md shadow-lg rounded-xl border border-gray-200 p-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
            <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
              <img
                src={user?.profilePicture || "/person-demo.jpg"}
                alt="profile"
                className="border rounded-full object-cover w-10 h-10"
              />
            </div>
            <h4 className="text-blue-900 font-semibold text-sm">
              {user?.fullname}
            </h4>
          </div>

          <div className="flex flex-col mt-3">
            <Link href="/profile">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg  hover:bg-gray-200 dark:hover:bg-gray-400   transition">
                <RiUser3Line className="text-gray-600 dark:text-white text-lg" />
                <h5 className="text-gray-800 dark:text-white text-sm">View Profile</h5>
              </div>
            </Link>
            <Link href="/settings">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-400  transition">
                <IoSettingsOutline className="text-gray-600 dark:text-white text-lg" />
                <h5 className="text-gray-800 dark:text-white text-sm">Settings</h5>
              </div>
            </Link>
          </div>

          <div
            className="flex items-center gap-3 px-4 py-2 mt-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
            onClick={handleLogout}
          >
            <IoLogOutOutline className="text-lg" />
            <h5 className="text-sm">Logout</h5>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
