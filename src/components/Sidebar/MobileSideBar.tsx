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

const MobileSideBar = () => {
  const pathname = usePathname();
  const [confirmLogout, setConfirmLogout] = useState<boolean>(false);
  const [isUploadPost, setIsUploadPost] = useState<boolean>(false);
  const [resizeSideBar, setResizeSideBar] = useState<boolean>(false);
  const router = useRouter();
  const { mutate: logout } = useLogoutMutation();
  const { user, fetchUser, isLoading } = useAuthStore();

  useEffect(() => {
    setResizeSideBar(
      pathname === "/message" ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/members")
    );
  }, [pathname]);

  const handleLogout = () => setConfirmLogout(true);

  const sureLogout = () => {
    logout();
    setConfirmLogout(false);
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
    ["/login", "/register", "/forgot-password", "/reset-password"].includes(
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
      <div className="z-40 fixed bottom-0 left-0 w-full md:hidden border-t bg-background dark:bg-gray-900 text-white dark:border-0">
        <div className="flex justify-around items-center py-3 w-screen">
          <Link href="/">
            <div className="flex items-center p-2 rounded-md cursor-pointer">
              <SlHome className="text-xl text-gray-200" />
            </div>
          </Link>

          <div
            onClick={() => setIsUploadPost(true)}
            className="flex items-center p-2 rounded-md cursor-pointer"
          >
            <FiPlusCircle className="text-xl text-gray-200" />
          </div>

          <Link href="/message">
            <div className="flex items-center p-2 rounded-md cursor-pointer">
              <LuMessageSquareText className="text-xl text-gray-200" />
            </div>
          </Link>

          <Link href="/profile">
            <div className="flex items-center p-2 rounded-md cursor-pointer">
              <FaRegUser className="text-xl text-gray-200" />
            </div>
          </Link>
          
        </div>
      </div>
    </>
  );
};

export default MobileSideBar;
