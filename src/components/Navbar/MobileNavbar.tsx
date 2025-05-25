"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiUser3Line, RiVerifiedBadgeFill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { useLogoutMutation } from "@/src/hooks/useAuth";
import useAuthStore from "../../store/useAuthStore";
import DarkModeToggle from "./DarkMode";
import Notification from "./Notification";
import UploadPost from "../UploadPost/UploadPost";
import Image from "next/image";

const MobileNavbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);

  const pathName = usePathname();
  const router = useRouter();
  const { mutate: logout } = useLogoutMutation();

  const { user, isLoading } = useAuthStore();

  const handleLogout = () => {
    logout();
    setShowProfile(false);
    router.replace("/login");
  };

  useEffect(() => {
    setShowProfile(false);
  }, [pathName]);


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
      className={`${
        pathName === "/message" && "hidden"
      } md:hidden w-full fixed top-0 $ z-20 h-20 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 border flex justify-between pl-3`}
    >
      {showUploadModal && (
        <UploadPost onClose={() => setShowUploadModal(false)} />
      )}
      <div className="flex items-center p-3 justify-between px-2">
        <Link href="/">
          <div className="relative w-28 h-[79px] ">
            <Image
              src="/zynk-mobile.png"
              alt="Light Logo"
              fill
              className="object-contain text-gray-600 dark:hidden"
            />
            <Image
              src="/zynk-dark.png"
              alt="Dark Logo"
              fill
              className="object-contain text-gray-600 hidden dark:block"
            />
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-2 pl-4 px-2">
        <span className="md:text-2xl cursor-pointer border rounded-full  hover:bg-gray-100 dark:hover:bg-gray-700">
          <DarkModeToggle />
        </span>

        <span
          className="md:text-2xl cursor-pointer border rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => {
            setShowNotification(!showNotification);
            setShowProfile(false);
          }}
        >
          <IoMdNotificationsOutline />
        </span>
        <div className="">
          {user && (
            <span
              className={isLoading ? "animate-pulse" : "cursor-pointer"}
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotification(false);
              }}
            >
              {user?.profilePicture ? (
                <Image
                  src={user?.profilePicture}
                  alt="profile"
                  width={40}
                  height={40}
                  className="md:w-10 w-9 h-9 md:h-10 border-2 border-gray-400 rounded-full object-cover"
                />
              ) : (
                <FaCircleUser className="w-10 h-10" />
              )}
            </span>
          )}
        </div>
      </div>

      {showNotification && (
        <Notification onClose={() => setShowNotification(false)} />
      )}
      {showProfile && (
        <div className="absolute right-3 mt-[70px] min-w-56 bg-gray-50 dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-600 p-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-600">
            <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
              <Image
                src={user?.profilePicture || "/person-demo.jpg"}
                alt="profile"
                width={40}
                height={40}
                className="border rounded-full object-cover w-10 h-10"
              />
            </div>
            <h4 className="text-blue-900 dark:text-gray-200 font-semibold text-sm">
              {user?.fullname}
            </h4>
            {user?.isVerified && (
              <span className="text-blue-600 font-extrabold text-base hover:text-blue-700">
                <RiVerifiedBadgeFill />
              </span>
            )}
          </div>

          <div className="flex flex-col mt-3">
            <Link href="/profile">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg  hover:bg-gray-200 dark:hover:bg-gray-700   transition">
                <RiUser3Line className="text-gray-600 dark:text-white text-lg" />
                <h5 className="text-gray-800 dark:text-white text-sm">
                  View Profile
                </h5>
              </div>
            </Link>
            <Link href="/profile/settings/edit-profile">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700  transition">
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

export default MobileNavbar;