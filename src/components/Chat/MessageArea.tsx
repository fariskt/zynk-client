import { formatMessageDate } from "@/src/utils/DateFormater/DateFormat";
import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";

interface User {
  _id: string;
  fullname: string;
  profilePicture?: string;
}

interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp?: string | Date;
}

interface MessageAreaProps {
  messages: Record<string, Message[]>;
  selectChatUser: User;
  messageRef: React.RefObject<HTMLDivElement | null>;
}

const MessageArea: React.FC<MessageAreaProps> = ({ messages, selectChatUser, messageRef }) => {
  const { user } = useAuthStore();
  const [startDate, setStartDate] = useState<string | null>(null);

  useEffect(() => {
    if (messages && messages[selectChatUser._id]?.length > 0) {
      const firstMessageTimestamp = messages[selectChatUser._id][0]?.timestamp;
      if (firstMessageTimestamp) {
        setStartDate(formatMessageDate(firstMessageTimestamp));
      }
    }
    
    messageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, selectChatUser, messageRef]);

  return (
    <div className="flex-1 p-4 flex flex-col max-h-[490px] gap-2 overflow-y-auto custom-scrollbar-chat pb-8 dark:bg-gray-900">
      {startDate && (
        <div className="text-center text-sm text-gray-600 mb-4">
          <p>Conversation started on {startDate}</p>
        </div>
      )}
      {messages && messages[selectChatUser._id]?.length > 0 ? (
        messages[selectChatUser._id].map((msg, index, arr) => {
          const isSender = msg.senderId === user?._id;
          const prevMsg = index > 0 ? arr[index - 1] : null;
          const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;

          return (
            <div key={index} className={`flex gap-3 ${isSender ? "justify-end mb-2" : "mb-2"}`}>
              {!isSender && !isSameSender && (
                <img
                  src={selectChatUser?.profilePicture || "/person-demo.jpg"}
                  className="h-8 w-8 rounded-full"
                  alt={selectChatUser?.fullname || "User"}
                />
              )}
              <div className={`${isSender ? "items-end" : ""} flex flex-col`}>
                {!isSender && !isSameSender && (
                  <p className="flex items-center gap-2 mb-2 text-sm font-normal">
                    {selectChatUser?.fullname || "Unknown User"}
                  </p>
                )}
                <div
                  className={`flex flex-row items-end gap-2 ${isSameSender && !isSender && "ml-10"}  px-2 py-2 ${isSender ? "bg-blue-500 dark:bg-blue-900 text-white rounded-tl-lg rounded-tr-none rounded-bl-lg rounded-br-2xl" : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200  text-black rounded-tl-none rounded-tr-lg rounded-bl-2xl rounded-br-lg"}`}
                >
                  <p className="max-w-md">{msg.text}</p>
                  <small className="text-[10px] text-gray-700 dark:text-gray-400">
                    {formatMessageDate(msg.timestamp || "")}
                  </small>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center">No messages yet.</p>
      )}
      <div ref={messageRef}></div>
    </div>
  );
};

export default MessageArea;
