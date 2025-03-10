import React, { useState } from "react";
import Suggestion from "../SuggestList/Suggestion";
import Image from "next/image";
import { FaArrowRightLong } from "react-icons/fa6";
import { useFetchUserActivity, useSendFollowReq } from "@/src/hooks/useUser";
import Link from "next/link";
import Activity from "./Activity";
import useAuthStore from "@/src/store/useAuthStore";

const SuggestedFriends = ({ users }: { users: any }) => {
  const [showModal, setShowModal] = useState(false);
  const { user: loggedUser } = useAuthStore();
  const { mutate: sendFollowReqMutation } = useSendFollowReq();

  const handleFollowReq = (userId: string) => {
    sendFollowReqMutation(userId, {});
  };

  const slugify = (fullname: string) =>
    fullname.toLowerCase().replace(/\s+/g, "-");

  const { data: recentActivities, isLoading: activityIsLoading } =
    useFetchUserActivity(loggedUser?._id || "");

  return (
    <>
      <div className="md:w-[377px] md:mb-0 mb-5 bg-white dark:bg-gray-900 py-4 border-l dark:border-l-0 dark:text-white px-8 relative bottom-7 shadow-md md:min-h-screen md:mt-0 mt-5 rounded-b-lg">
        {/* Friend Suggestions */}
        <div className="flex justify-between items-center mb-4 pb-2">
          <h2 className="text-lg font-semibold">Friend Suggestions</h2>
          <div
            className="flex items-center gap-2 cursor-pointer "
            onClick={() => setShowModal(true)}
          >
            <p className="text-blue-500 text-sm">See All</p>
            <span className="text-sm -rotate-45 text-blue-800">
              <FaArrowRightLong />{" "}
            </span>
          </div>
        </div>

        <ul className="border-b dark:border-b-gray-600 pb-4">
          {users?.data?.slice(0, 4).map((friend: any) => (
            <div
              key={friend._id}
              className="flex items-center justify-between py-2 last:border-b-0"
            >
              <Link
                key={friend._id}
                href={`/members/${slugify(friend.fullname)}-${friend._id}`}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={friend.profilePicture || "/person-demo.jpg"}
                    alt={friend.fullname}
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10 object-cover"
                  />
                  <div>
                    <p className="text-gray-900 dark:text-white text-sm font-medium">
                      {friend.fullname}
                    </p>
                  </div>
                </div>
              </Link>
              <button
                className="p-2 bg-blue-500 text-white min-w-20 text-xs hover:bg-blue-700 rounded-2xl font-medium"
                onClick={() => handleFollowReq(friend._id)}
              >
                {loggedUser?.following?.includes(friend._id) ? (
                  "Unfollow"
                ) : friend?.following?.includes(loggedUser?._id) ? (
                  "Follow back"
                ) : (
                  "Follow"
                )}
              </button>
            </div>
          ))}
        </ul>

        <div className="mt-6 md:block hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-300  pb-2">
            Recent Activity
          </h2>

          {activityIsLoading ? (
            <p className="text-gray-500 text-sm">
              Loading recent activities...
            </p>
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
                      src={activity?.user?.profilePicture || "/person-demo.jpg"}
                      alt="profile-pic"
                      width={40}
                      height={40}
                      className="rounded-full w-10 h-10 object-cover"
                    />

                    <div className="text-sm text-gray-700 dark:text-white flex items-center gap-1 w-full max-w-[300px] flex-wrap  text-ellipsis">
                      {activity.type === "comment" ? (
                        <>
                          <p className="text-gray-600 dark:text-gray-300 font-semibold max-w-[300px] line-clamp-3 leading-snug break-words">
                            You commented on{" "}
                            <i className="text-blue-500 mx-1">
                              {activity?.postTitle}
                            </i>
                            :{" "}
                            <span className="font-semibold text-black dark:text-gray-300">
                              {activity?.content}
                            </span>
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-600 dark:text-gray-300 font-semibold">
                            You liked{" "}
                            <i className="text-blue-500">
                              {" "}
                              {`${
                                activity?.postTitle.length > 10
                                  ? activity?.postTitle.slice(0, 20)
                                  : activity?.postTitle
                              }`}
                            </i>{" "}
                            by{" "}
                            <span className="font-semibold text-black dark:text-gray-300 ">
                              {activity?.postOwner?.fullname}
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
      </div>

      {showModal && (
        <Suggestion
          setShowModal={setShowModal}
          users={users}
          handleFollowReq={handleFollowReq}
          loggedUser={loggedUser}
        />
      )}
    </>
  );
};

export default SuggestedFriends;
