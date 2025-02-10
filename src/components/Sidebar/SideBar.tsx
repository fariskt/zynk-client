"use client";

import { LuLayoutDashboard } from "react-icons/lu";
import { SlHome } from "react-icons/sl";
import { LuMessageSquareText } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import { FiLogOut, FiPlusCircle } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadPost from "../UploadPost/UploadPost";
import { useLogoutMutation } from "@/src/hooks/useAuth";

const SideBar = () => {
  const [resizeSideBar, setResizeSideBar] = useState<boolean>(false);
  const pathname = usePathname();
  const [confirmLogout, setConfirmLogout] = useState<boolean>(false);
  const [isUploadPost, setIsUploadPost] = useState<boolean>(false);
  const router = useRouter();

  const { mutate: logout } = useLogoutMutation();

  const handleLogout = () => {
    setConfirmLogout(true);
  };
  const sureLogout = () => {
    logout();
    router.replace("/login");
  };

  if (
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"
  ) {
    return null;
  }

  return (
    <>
      {isUploadPost && <UploadPost onClose={() => setIsUploadPost(false)} />}
      {confirmLogout && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white dark:bg-gray-900 dark:text-white p-6 w-96 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-4">
              Are you sure you want to logout?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                onClick={() => setConfirmLogout(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
                onClick={sureLogout}
              >
                Sure
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`z-10 fixed border-r ${
          resizeSideBar ? "w-20" : "w-[200px]"
        } h-full top-16 transition-all  ease-in-out bg-white dark:bg-gray-900 dark:text-white dark:border-0`}
      >
        <span onClick={() => setResizeSideBar(!resizeSideBar)}>
          <LuLayoutDashboard
            className={`${
              resizeSideBar ? "rotate-90" : "rotate-180"
            } text-2xl cursor-pointer mt-7 ml-8 transition-all`}
          />
        </span>
        <div className="flex flex-col justify-between h-[70%] mt-14 flex-wrap ml-3 ">
          <div className="flex flex-col gap-3 mx-4">
            <Link href="/">
              <div
                className={`${
                  pathname === "/" && "bg-slate-200 dark:bg-gray-600"
                } flex items-center p-2 rounded-md gap-4 h-10 cursor-pointer`}
              >
                <SlHome className="text-lg" />
                {!resizeSideBar && <h3>Home</h3>}
              </div>
            </Link>

            <Link href="/profile">
              <div
                className={`${
                  pathname?.startsWith("/profile") &&
                  "bg-slate-200 dark:bg-gray-600"
                } flex items-center p-2 rounded-md gap-4 h-10 cursor-pointer`}
              >
                <FaRegUser className="text-lg" />
                {!resizeSideBar && <h3>Profile</h3>}
              </div>
            </Link>

            <Link href="/chat">
              <div
                className={`${
                  pathname === "/chat" && "bg-slate-200 dark:bg-gray-600"
                } flex items-center p-2 rounded-md gap-4 h-10 cursor-pointer`}
              >
                <LuMessageSquareText className="text-lg" />
                {!resizeSideBar && <h3>Message</h3>}
              </div>
            </Link>

            <div
              onClick={() => setIsUploadPost(true)}
              className={`${
                pathname === "/create" && "bg-slate-200 dark:bg-gray-600"
              } flex items-center p-2 rounded-md gap-4 h-10 cursor-pointer`}
            >
              <FiPlusCircle className="text-lg" />
              {!resizeSideBar && <h3>Create</h3>}
            </div>
          </div>
          <div
            className="flex items-center p-2 rounded-md hover:bg-slate-600 dark:text-white gap-4 h-10 cursor-pointer mx-4"
            onClick={handleLogout}
          >
            <FiLogOut className="text-lg" />
            {!resizeSideBar && <button>Logout</button>}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
