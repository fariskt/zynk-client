import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import AxiosInstance from "@/src/lib/axiosInstance";
import ConnectionListSkeleton from "@/src/utils/SkeltonUi/ConnectionListSkelton";
import { getRelativeTime } from "@/src/utils/DateFormater/DateFormat";
import Link from "next/link";
import { getSocket } from "@/src/lib/socket";

interface Notification {
  _id: string;
  sender: {
    _id: string;
    fullname: string;
    profilePicture?: string;
  };
  senderId: string;
  text: string;
  createdAt: string;
}

interface NotificationProps {
  onClose: ()=> void;
}

const Notification : React.FC<NotificationProps>= ({ onClose }) => {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socket = getSocket();

  const { isLoading } = useQuery({
    queryKey: ["fetchNotification"],
    queryFn: async () => {
      const res = await AxiosInstance.get("/user/notification/allNotification");
      console.log(res.data);
      setNotifications(res.data?.notification || []);
      return res.data;
    },
    enabled: !!user?._id,
  });

  useEffect(() => {
    if (user?._id) {
      socket.emit("user_connected", user._id);

      socket.on("receive_notification", (data) => {
        setNotifications((prev) => [data, ...prev]);
      });

      return () => {
        socket.off("receive_notification");
      };
    }
  }, [user]);

  const slugify = (fullname: string) => fullname?.toLowerCase().replace(/\s+/g, "-");

  console.log(notifications);

  return (
    <div className="absolute right-3 mt-[70px] w-96 bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white border-b dark:border-b-gray-500 pb-2">
        Notifications
      </h2>

      <div className="mt-3 space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <ConnectionListSkeleton />
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notification : Notification, index) => (
            <div
              key={index}
              className="flex items-center gap-2 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-transparent transition"
            >
              <img
                src={notification.sender?.profilePicture || "/person-demo.jpg"}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div className="flex justify-between w-full">
                  <p className="text-sm text-gray-600 dark:text-gray-300 max-w-[80%]">
                <Link
                  key={notification.senderId}
                  onClick={onClose}
                  href={`/members/${slugify(notification?.sender?.fullname)}-${notification.sender._id}`}>
                    <span className="font-medium text-sm dark:text-white">
                      {notification.sender.fullname}
                    </span>
                    {notification.text?.replace(notification.sender.fullname,"")}
                </Link>
                  </p>
                <span className="text-xs dark:text-gray-200 text-gray-600 w-14 text-right">
                  {notification?.createdAt &&
                    getRelativeTime(notification?.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center">
            No notifications yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notification;
