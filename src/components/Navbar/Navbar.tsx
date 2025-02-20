"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiUser3Line } from "react-icons/ri";
import { IoSearch, IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { useLogoutMutation } from "@/src/hooks/useAuth";
import useAuthStore from "../../store/useAuthStore";
import DarkModeToggle from "./DarkMode";
import Notification from "./Notification";
import { CiSettings } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import UploadPost from "../UploadPost/UploadPost";
import { useSearchUsers } from "@/src/hooks/useUser";
import SearchUsers from "./SearchUsers";

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState<string>("");
  const { mutate: logout } = useLogoutMutation();

  const isLogin = localStorage.getItem("isLogin") || "";

  const { user, isLoading } = useAuthStore();

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    router.replace("/login");
  };

  useEffect(() => {
    setShowProfile(false);
  }, [pathName]);

  const { data: searchedUsers, isLoading: searchLoading } = useSearchUsers(searchInput);


  if (
    pathName === "/login" ||
    pathName === "/register" ||
    pathName === "/forgot-password" ||
    pathName === "/reset-password"
  ) {
    return null;
  }

  return (
    <nav
      className={` fixed top-0 ${
        pathName === "/message" || pathName.startsWith("/profile") || pathName.startsWith("/members") ? "left-[80px] w-[95%]" : "w-[85%]"
      } left-[230px] z-20 bg-gray-50 dark:bg-gray-900 dark:text-white dark:border-gray-800 border flex justify-between pl-3`}
    >
      {showUploadModal && (
        <UploadPost onClose={() => setShowUploadModal(false)} />
      )}
      <div className="flex items-center p-3 justify-between px-10 w-full">
        <div className="flex items-center w-3/6">
          <input
            type="text"
            placeholder="search here..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-[#b5b3b3] pl-4 pb-1 h-10 dark:bg-gray-600 dark:border-gray-500 w-full rounded-full outline-none"
          />
          <span className="relative right-8 text-xl text-gray-600">
            <IoSearch />
          </span>
        </div>

        <div
          className="flex items-center bg-background rounded-full px-2 cursor-pointer"
          onClick={() => setShowUploadModal(true)}
        >
          <button className="text-sm  py-2 pl-2 font-semibold text-white">
            Add New Post
          </button>
          <span className="px-2 text-white text-lg">
            <FiPlus />
          </span>
        </div>
        {searchInput && (
          <div className="absolute top-8 w-4 left-9 h-14 border-l-2 border-t-2 border-gray-400 dark:border-gray-500 rounded-tl-lg"></div>
        )}
      </div>

      {searchInput && (
        <SearchUsers searchInput={searchInput} searchLoading={searchLoading} setSearchInput={setSearchInput} searchedUsers={searchedUsers}/>
      )}

      <div className="flex items-center justify-between w-[40%] gap-4 mr-5 p-3 border-l dark:border-l-gray-800">
        <div className="flex items-center gap-2 pl-4">
          <span className="text-2xl cursor-pointer border rounded-full  hover:bg-gray-100 dark:hover:bg-gray-700">
            <DarkModeToggle />
          </span>

          <span
            className="text-2xl cursor-pointer border rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => {
              setShowNotification(!showNotification);
              setShowProfile(false);
            }}
          >
            <IoMdNotificationsOutline />
          </span>
          <span className="text-2xl cursor-pointer border rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            <Link href="/settings">
              <CiSettings />
            </Link>
          </span>
        </div>

        <div className="relative">
          {isLogin !== "" && (
            <span
              className={isLoading ? "animate-pulse" : "cursor-pointer"}
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotification(false);
              }}
            >
              {user?.profilePicture ? (
                <img
                  src={user?.profilePicture}
                  alt="profile"
                  className="w-10 h-10 border-2 border-gray-400 rounded-full object-cover"
                />
              ) : (
                <FaCircleUser className="w-10 h-10" />
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </span>
          )}
        </div>
      </div>

      {showNotification && <Notification />}
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
                <h5 className="text-gray-800 dark:text-white text-sm">
                  View Profile
                </h5>
              </div>
            </Link>
            <Link href="/settings">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-400  transition">
                <IoSettingsOutline className="text-gray-600 dark:text-white text-lg" />
                <h5 className="text-gray-800 dark:text-white text-sm">
                  Settings
                </h5>
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
