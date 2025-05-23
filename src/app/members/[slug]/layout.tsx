"use client";

import useAuthStore from "@/src/store/useAuthStore";
import { useFetchUserById, useSendFolllowReq } from "@/src/hooks/useUser";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { LuPencilLine } from "react-icons/lu";
import { TbMessage } from "react-icons/tb";
import { useChatStore } from "@/src/store/useChatStore";
import { User } from "@/src/types";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter()
  const { user: loggedUser, fetchUser } = useAuthStore();
  const slug = params?.slug as string;
  const friendId = slug?.split("-").pop() || "";
  
  const { data: user, isLoading, error } = useFetchUserById(friendId || "");

  const { mutate: sendFollowReqMutation } = useSendFolllowReq();
  const {setSelectChatUser} = useChatStore()


  const handleFollowReq = (freindId: string) => {
    sendFollowReqMutation(freindId, {
      onSuccess: () => {
        fetchUser();
      },
      onError: (error: any) => {
        console.error("Error sending follow request ", error);
      },
    });
  };

  const handleMessgeUser = (user: User)=> {
    setSelectChatUser(user)
    router.push(`/message`)
  }

  return (
    <div className="max-w-6xl mt-24 mx-auto">
      <div className="w-full border dark:border-0 shadow-md rounded-xl">
        <div className="relative">
          <img
            src="/cover-sample.jpg"
            className="w-full h-56 rounded-md object-cover"
            alt="Cover"
          />
        </div>

        <div className="flex justify-between px-6 py-4 bg-white dark:bg-gray-900 dark:text-white">
          <div className="flex">
            <img
              src={user?.user?.profilePicture || "/person-demo.jpg"}
              className="rounded-full h-32 w-32 object-cover z-10 bg-white -mt-16 border-4 border-gray-900"
              alt="Profile"
            />
            <div className="ml-6">
              <h2 className="text-xl font-semibold">{user?.user?.fullname}</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Joined :{" "}
                {new Date(user?.user?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="space-x-4 flex items-center">
            <button
              onClick={() => handleFollowReq(user?.user?._id)}
              className={`ml-auto px-4 py-2 rounded-md ${
                loggedUser?.following?.includes(user?.user?._id) ||
                user?.user?.following?.includes(loggedUser?._id)
                  ? "bg-background text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {loggedUser?.following?.includes(user?.user?._id)
                ? "Following"
                : user?.user?.following?.includes(loggedUser?._id)
                ? "Follow back"
                : "Follow"}
            </button>

            <button onClick={()=> handleMessgeUser(user?.user)} className="flex gap-2 items-center ml-auto px-4 py-2 rounded-md bg-background text-white hover:bg-blue-800">
              <span>
                <TbMessage />
              </span>
              Message
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 dark:text-white flex items-center border-t border-t-gray-700 justify-between px-6 py-1">
          <div className="flex gap-8">
            <Link href="/profile">
              <h4 className="cursor-pointer">Posts</h4>
            </Link>
            <Link href="/profile/about">
              <h4 className="cursor-pointer">About</h4>
            </Link>
            <Link href={`/members/${slug}/friends`}>
              <h4 className="cursor-pointer">Friends</h4>
            </Link>
          </div>
          <div className="flex gap-8 pt-2 pb-2">
            <div>
              <h4>Posts</h4>
              <p className="text-center dark:text-orange-100 text-blue-500">
                {user?.user?.postCount || 0}
              </p>
            </div>
            <div>
              <h4>Followers</h4>
              <p className="text-center dark:text-orange-100 text-blue-500">
                {user?.user?.followers?.length || 0}
              </p>
            </div>
            <div>
              <h4>Following</h4>
              <p className="text-center dark:text-orange-100 text-blue-500">
                {user?.user?.following?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 ">{children}</div>
    </div>
  );
}
