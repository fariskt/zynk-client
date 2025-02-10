import React from 'react';

const Suggestion = ({
  setShowModal,
  loggedUser,
  handleFollowReq,
  users,
}: {
  setShowModal: (value: boolean) => void;
  loggedUser: any;
  handleFollowReq: (userId: string) => void;
  users: any;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 dark:text-white">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg w-[90%] max-w-md shadow-lg">
        <div className="flex justify-between">
          <h3 className="text-xl mb-3">Explore Members</h3>
          <button className="right-4 text-gray-600 dark:text-white" onClick={() => setShowModal(false)}>
            ✕
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-6">
          {users?.data
            ?.filter((user: { _id: string }) => user._id !== loggedUser?._id)
            .map((user: { _id: string; fullname: string; profilePicture: string , following: string}) => (
              <div className="flex items-center justify-between px-2 mt-3" key={user._id}>
                <div className="flex items-center gap-2">
                  <img
                    src={user.profilePicture || "/person-demo.jpg"}
                    className="w-10 h-10 object-contain border dark:border-gray-500 rounded-full"
                    alt=""
                  />
                  <h5>{user.fullname || "username"}</h5>
                </div>
                <button className="text-gray-200 bg-blue-800  min-w-20 px-1 rounded-md h-8" onClick={() => handleFollowReq(user._id)}>
                {loggedUser?.following?.includes(user._id)
                    ? "Unfollow"
                    : user?.following?.includes(loggedUser?._id)
                    ? "Follow back"
                    : "Follow"}                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestion;
