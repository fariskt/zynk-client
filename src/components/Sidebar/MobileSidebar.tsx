"use client";

import { SlHome } from "react-icons/sl";
import { LuMessageSquareText } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import { FiPlusCircle } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UploadPost from "../UploadPost/UploadPost";
import { useFetchLoggedUser, useLogoutMutation } from "@/src/hooks/useAuth";
import useAuthStore from "../../store/useAuthStore";
import ConfirmLogout from "./ConfirmLogout";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import ConnectionListSkeleton from "@/src/utils/SkeltonUi/ConnectionListSkelton";
import { useSearchUsers } from "@/src/hooks/useUser";
import { User } from "@/src/types";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const MobileSideBar = () => {
  const pathname = usePathname();
  const [confirmLogout, setConfirmLogout] = useState<boolean>(false);
  const [isUploadPost, setIsUploadPost] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<string>("");
  const [searchUser, setSearchUser] = useState<string>("");

  const { data: searchedUsers, isLoading: searchIsLoading } =
    useSearchUsers(searchUser);

  const router = useRouter();
  const { mutate: logout } = useLogoutMutation();
  const { setUser } = useAuthStore();

  const { data: user } = useFetchLoggedUser();

  const sureLogout = () => {
    logout();
    setConfirmLogout(false);
    router.replace("/login");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLogin(localStorage.getItem("isLogin") || "");
    }
  }, []);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [isLogin, setUser]);

  const slugify = (fullname: string) =>
    fullname.toLowerCase().replace(/\s+/g, "-");

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
          {showSearch && (
            <div
              onClick={() => setShowSearch(false)}
              className="fixed inset-0 flex justify-center items-center bg-gray-400 dark:bg-gray-900/80 bg-opacity-5 backdrop-blur-sm z-50 p-4"
            >
              <div
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-md "
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-center my-4 text-lg">Search Users</h2>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="border dark:border-gray-500 w-full rounded-3xl px-3 pl-10 py-2 bg-transparent focus:outline-none mb-3"
                />
                <div className="h-64 overflow-y-auto custom-scrollbar">
                  {searchIsLoading ? (
                    <ConnectionListSkeleton />
                  ) : searchedUsers?.data && searchedUsers.data.length > 0 ? (
                    searchedUsers.data.map((person: User) => (
                      <Link
                      key={person._id}
                        href={`/members/${slugify(person.fullname)}-${
                          person._id
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 py-3 px-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/20 rounded-lg"
                        >
                          <Image
                            height={40}
                            width={40}
                            src={person.profilePicture || "/person-demo.jpg"}
                            alt="User"
                            className="h-10 w-10 object-cover rounded-full"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">
                              {person.fullname || "Username"}
                            </span>
                            {person?.isPremium && (
                              <span className="text-blue-600 font-extrabold text-base pt- hover:text-blue-700">
                                <RiVerifiedBadgeFill />
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : searchUser && !searchIsLoading ? (
                    <div className="text-center text-gray-500">
                      No users found
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
          <span
            className="text-xl  text-gray-200"
            onClick={() => setShowSearch(!showSearch)}
          >
            <IoSearch />
          </span>

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
