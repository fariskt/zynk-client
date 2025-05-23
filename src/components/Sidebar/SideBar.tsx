"use client";

import { SlHome } from "react-icons/sl";
import { LuMessageSquareText } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import { FiLogOut, FiPlusCircle } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UploadPost from "../UploadPost/UploadPost";
import { useLogoutMutation } from "@/src/hooks/useAuth";
import useAuthStore from "../../store/useAuthStore";
import ConfirmLogout from "./ConfirmLogout";

const SideBar = () => {
  const pathname = usePathname();
  const [confirmLogout, setConfirmLogout] = useState<boolean>(false);
  const [isUploadPost, setIsUploadPost] = useState<boolean>(false);
  const [resizeSideBar, setResizeSideBar] = useState<boolean>(false);
  const router = useRouter();
  const { mutate: logout } = useLogoutMutation();
  const { user, fetchUser, isLoading } = useAuthStore();

  useEffect(() => {
    setResizeSideBar(pathname === "/message" || pathname.startsWith("/profile") || pathname.startsWith("/members"));
  }, [pathname]);

  const handleLogout = () => setConfirmLogout(true);

  const sureLogout = () => {
    logout();
    setConfirmLogout(false)
    router.replace("/login");
  };

  const isLogin = localStorage.getItem("isLogin");
  const theme = localStorage.getItem("theme");
  useEffect(() => {
    if (isLogin) {
      fetchUser();
    }
  }, [isLogin]);

  if (
    ["/login", "/register", "/forgot-password", "/reset-password", "/verify"].includes(
      pathname
    )
  ) {
    return null;
  }

  return (
    <>
      {isUploadPost && <UploadPost onClose={() => setIsUploadPost(false)} />}
      {confirmLogout && (
        <ConfirmLogout
          setConfirmLogout={setConfirmLogout}
          sureLogout={sureLogout}
        />
      )}
      <div
        className={`z-10 fixed border-r ${
          resizeSideBar ? "w-20 shadow-md" : "w-[230px]"
        } h-full top-0 transition-all ease-in-out bg-background dark:bg-gray-900 text-white dark:border-0`}
      >
        <div className="flex flex-col justify-between h-[92%] mt-4 flex-wrap ml-3">
          <div className="flex flex-col gap-3 mx-4">
            <Link href="/">
              <img
                src={
                  resizeSideBar
                    ? theme === "light"
                      ? "/zk-white.png"
                      : "/zk-dark.png"
                    : theme === "dark"
                    ? "/zynk-dark.png"
                    : "/zynk-white.png"
                }
                alt="Logo"
                className={`h-20 w-28 object-cover text-gray-600 ${
                  pathname !== "/message" ? "" : ""
                }`}
              />
            </Link>
            <Link href="/">
              <div className="flex items-center p-2 rounded-md gap-3 h-10 cursor-pointer">
                <SlHome className="text-lg text-gray-200" />
                {!resizeSideBar && (
                  <h3 className="text-base font-medium">Home</h3>
                )}
              </div>
            </Link>
            {/* Profile Link */}
            <Link href="/profile">
              <div className="flex items-center p-2 rounded-md gap-3 h-10 cursor-pointer">
                <FaRegUser className="text-lg text-gray-200" />
                {!resizeSideBar && (
                  <h3 className="text-base font-medium">Profile</h3>
                )}
              </div>
            </Link>

            {/* Chat Link */}
            <Link href="/message">
              <div className="flex items-center p-2 rounded-md gap-3 h-10 cursor-pointer">
                <LuMessageSquareText className="text-lg text-gray-200" />
                {!resizeSideBar && (
                  <h3 className="text-base font-medium">Message</h3>
                )}
              </div>
            </Link>

            {/* Create Link */}
            <div
              onClick={() => setIsUploadPost(true)}
              className="flex items-center p-2 rounded-md gap-3 h-10 cursor-pointer"
            >
              <FiPlusCircle className="text-lg text-gray-200" />
              {!resizeSideBar && (
                <h3 className="text-base font-medium">Create</h3>
              )}
            </div>
          </div>

          {/* Logout */}
          <div className="flex justify-between items-center border-t border-t-gray-300 dark:border-t-gray-600 pt-5 mx-2 mr-5">
            {!resizeSideBar && (
              <div className="flex items-center  gap-2">
                <img
                  src={user?.profilePicture || "/person-demo.jpg"}
                  className="h-8 rounded-full w-8 object-cover"
                  alt=""
                />
                <p className="text-sm font-medium">
                  {user?.fullname || "Unknown"}
                </p>
              </div>
            )}
            <FiLogOut
              onClick={handleLogout}
              className="text-xl mx-auto font-semibold text-white cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
