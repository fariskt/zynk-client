import { User } from "@/src/types";
import Link from "next/link";
import React from "react";

const Suggestion = ({setShowModal,loggedUser, handleFollowReq,users}: {
  setShowModal: (value: boolean) => void;
  loggedUser: User | null;
  handleFollowReq: (userId: string) => void;
  users: User[];
}) => {
  const slugify = (fullname: string) => fullname.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-lg z-50 p-4"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white dark:bg-gray-900 dark:text-white p-6 rounded-2xl w-[90%] max-w-md shadow-xl transform scale-95 animate-fadeIn transition-all"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Explore Members</h3>
          <button
            className="text-gray-500 dark:text-white hover:text-red-500 transition"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar">
          {users?.map(
            (user: User) => (
              <div
                className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                key={user._id}
              >
                <Link
                  key={user._id}
                  href={`/members/${slugify(user.fullname)}-${user._id}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilePicture || "/person-demo.jpg"}
                      className="w-12 h-12 object-cover border dark:border-gray-500 rounded-full"
                      alt=""
                    />
                    <h5 className="text-lg font-medium">
                      {user.fullname || "Username"}
                    </h5>
                  </div>
                </Link>

                <button
                  className="p-2 bg-blue-500 text-white min-w-20 text-sm hover:bg-blue-700 rounded-2xl font-medium"
                  onClick={() => handleFollowReq(user._id)}
                >
                  {loggedUser?.following?.includes(user._id)
                    ? "Unfollow"
                    : user?.following?.includes(loggedUser?._id || "")
                    ? "Follow back"
                    : "Follow"}
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
