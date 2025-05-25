"use client"

import Image from "next/image";
import React from "react";
import useAuthStore from "../../store/useAuthStore";
import { useFetchUserActivity } from "@/src/hooks/useUser";
import { useParams, usePathname } from "next/navigation";

interface Activity {
  type: "comment" | "like";
  user: {
    fullname: string;
    profilePicture: string;
  };
  postTitle: string;
  postOwner?: {
    fullname: string;
  };
  content?: string;
  createdAt: string;
}

const Activity = () => {
  const params = useParams();
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  const slug = params?.slug as string;
  
  const friendId = slug?.split('-').pop();
  const freindName = slug?.split('-').slice(0, -1).join('-');
  const userID = pathname.startsWith("/members") ? friendId || "" : user?._id || "";
  const { data: recentActivities, isLoading: activityIsLoading } =  useFetchUserActivity(userID);

  return (
    <div className="mt-5 dark:bg-gray-900 p-3 rounded-lg h-fit md:w-3/6 mx-5 md:mx-0 shadow border dark:border-0">
      <h2 className="text-base border-b dark:border-b-gray-600 font-semibold text-gray-900 dark:text-gray-300  pb-4">
        Recent Activity
      </h2>

      {activityIsLoading ? (
        <p className="text-gray-500 text-sm">Loading recent activities...</p>
      ) : recentActivities?.activities?.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300  text-sm mt-2">
          No recent activity.
        </p>
      ) : (
        <div>
          {recentActivities?.activities
            .slice(0, 4)
            .map((activity: Activity, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2   p-3 rounded-lg "
              >
                <Image
                  src={activity.user.profilePicture || "/person-demo.jpg"}
                  alt="profile-pic"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 object-cover"
                />

                <div className="text-sm text-gray-700 dark:text-white flex items-center gap-1 w-full max-w-[300px] flex-wrap  text-ellipsis">
                  {activity.type === "comment" ? (
                    <>
                     <p className="text-gray-600 dark:text-gray-300 font-semibold max-w-[300px] line-clamp-3 leading-snug break-words">
                            {pathname.startsWith("/members") ? freindName : "You"} commented on{" "}
                            <i className="text-blue-500 mx-1">
                              {activity.postTitle}
                            </i>
                            :{" "}
                            <span className="font-semibold text-black dark:text-gray-300">
                              {activity.content}
                            </span>
                          </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 dark:text-gray-300 font-semibold">
                      {pathname.startsWith("/members") ? freindName.charAt(0).toUpperCase() + freindName.slice(1): "You"}  liked{" "}
                        <i className="text-blue-500">
                          {" "}
                          {`${
                            activity.postTitle.length > 10
                              ? activity.postTitle.slice(0, 20)
                              : activity.postTitle
                          }`}
                        </i>{" "}
                        by{" "}
                        <span className="font-semibold text-black dark:text-gray-300 ">
                          {activity.postOwner?.fullname}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Activity;