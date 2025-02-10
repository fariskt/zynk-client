import React, { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import AxiosInstance from "@/src/lib/axiosInstance";
import Suggestion from "../SuggestList/Suggestion";

const sendFollow = async (userId: string) => {
  const res = await AxiosInstance.post("/user/follow-request", { userId });
  return res.data;
};

const SuggestedFreinds = ({
  isLoading,
  users,
  loggedUser,
}: {
  isLoading: boolean;
  users: any;
  loggedUser: any;
}) => {
  const { fetchUser } = useAuthStore();
  const sendFollowReqMutation = useMutation({
    mutationFn: sendFollow,
    onSuccess: () => fetchUser(),
  });

  const handleFollowReq = (userId: string) => {
    sendFollowReqMutation.mutate(userId);
  };

  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  return (
    <>
      <div
        className={`${
          isLoading ? "animate-pulse bg-gray-400" : ""
        } bg-white dark:bg-gray-900 dark:text-white dark:border-0 shadow border max-w-[260px] rounded-md mb-8 p-3`}
      >
        <h3>Members</h3>
        {users?.data
          ?.filter((user: { _id: string }) => user._id !== loggedUser?._id)
          .slice(0, visibleCount)
          .map(
            (user: {
              _id: string;
              fullname: string;
              profilePicture: string;
              following: string;
            }) => (
              <div
                className="flex items-center justify-between px-2 mt-5"
                key={user._id}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.profilePicture || "/person-demo.jpg"}
                    className="w-10 h-10 object-contain border dark:border-gray-500 rounded-full"
                    alt=""
                  />
                  <h5>{user.fullname || "username"}</h5>
                </div>
                <button
                  className="text-gray-200 bg-blue-800 min-w-16 px-1 rounded-md h-7 text-sm"
                  onClick={() => handleFollowReq(user._id)}
                >
                  {loggedUser?.following?.includes(user._id)
                    ? "Unfollow"
                    : user?.following?.includes(loggedUser?._id)
                    ? "Follow back"
                    : "Follow"}
                </button>
              </div>
            )
          )}
        <button
          className="mt-4 w-full text-center text-blue-600"
          onClick={() => setShowModal(true)}
        >
          See More
        </button>
      </div>

      {/* Modal */}
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

export default SuggestedFreinds;
