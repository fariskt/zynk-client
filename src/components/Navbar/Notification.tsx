import React from "react";
import useAuthStore from "../../store/useAuthStore";


const Notification = () => {
  const { user } = useAuthStore();

  const notifications = [
    {
      id: 1,
      sender: "John Doe",
      profilePicture: "/person-demo.jpg",
      message: "sent you a friend request.",
    },
    {
      id: 2,
      sender: "Alice Smith",
      profilePicture: "/person-demo.jpg",
      message: "liked your post.",
    },
  ];

  return (
    <div className="absolute right-3 mt-[70px] w-80 bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b pb-2">
        Notifications
      </h2>

      {/* Notifications List */}
      <div className="mt-3 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <img
              src={notification.profilePicture}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {notification.sender}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {notification.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
