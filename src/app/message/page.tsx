"use client";

import useAuthStore from "@/src/store/useAuthStore";
import { useSearchUsers, useUserConnections } from "@/src/hooks/useUser";
import AxiosInstance from "@/src/lib/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { CiSearch } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { LuSend } from "react-icons/lu";
import { GrEmoji } from "react-icons/gr";
import { GoPlus } from "react-icons/go";
import { getLastMessageDate } from "@/src/utils/DateFormater/DateFormat";
import MessageArea from "@/src/components/Chat/MessageArea";
import ConnectionListSkeleton from "@/src/utils/SkeltonUi/ConnectionListSkelton";
import SearchedUsers from "@/src/components/Chat/SearchedUsers";

const socket = io("http://localhost:5000");

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

type MessagesState = Record<string, Message[]>;

const ChatApp = () => {
  const { user } = useAuthStore();
  const { isLoading } = useUserConnections(user?._id || "");
  const [chatUsers, setChatUsers] = useState<User[]>([]);
  const [selectChatUser, setSelectChatUser] = useState<User | null>(null);
  const [searchUser, setSearchUser] = useState<string>("");
  const [messages, setMessages] = useState<MessagesState>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showSearchModal, setShowSearchUserModal] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement | null>(null);

  const { data: searchedUsers, isLoading: searchIsLoading } = useSearchUsers(searchUser);

  useEffect(() => {
    if (!user?._id) return;

    const handleReceiveMessage = (message: Message) => {
      setMessages((prevMessages) => {
        const chatId =
          message.senderId === user._id ? message.receiverId : message.senderId;
        return {
          ...prevMessages,
          [chatId]: [...(prevMessages[chatId] || []), message],
        };
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("user_connected", user._id);

    return () => {
      socket.emit("user_disconnected", user._id);
    };
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("online_users", handleOnlineUsers);
    };
  }, [user?._id]);

  useEffect(() => {
    const fetchChatUsers = async () => {
      if (!user?._id) return;

      try {
        const response = await AxiosInstance.get(`/chat/chats/${user._id}`);
        const chatUsers = response.data;
        setChatUsers(chatUsers);

        const messagesMap = await Promise.all(
          chatUsers.map(async (chatUser: User) => {
            const res = await AxiosInstance.get(
              `/chat/chat/${user._id}?otherUserId=${chatUser._id}`
            );
            return { userId: chatUser._id, messages: res.data.messages || [] };
          })
        );

        const messagesState = messagesMap.reduce(
          (acc, item) => ({ ...acc, [item.userId]: item.messages }),
          {} as MessagesState
        );

        setMessages(messagesState);
      } catch (error) {
        console.error("Error fetching chat users:", error);
      }
    };

    fetchChatUsers();
    
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id || !selectChatUser?._id) return;

    const fetchSingleChat = async () => {
      try {
        const response = await AxiosInstance.get(
          `/chat/chat/${user._id}?otherUserId=${selectChatUser._id}`
        );
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectChatUser._id]: response.data.messages,
        }));
      } catch (error) {
        console.error("Error fetching single chat:", error);
      }
    };

    fetchSingleChat();
  }, [selectChatUser, user?._id]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectChatUser || !user?._id) return;

    const messageData: Message = {
      senderId: user._id,
      receiverId: selectChatUser._id,
      text: newMessage,
      timestamp: new Date(),
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => ({
      ...prev,
      [selectChatUser._id]: [...(prev[selectChatUser._id] || []), messageData],
    }));
    setNewMessage("");
  };

  return (
    <div className="h-screen  fixed w-[95%] flex ml-20 mt-16">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-l border-gray-300 dark:bg-gray-900 dark:border-gray-800 pt-8 dark:text-white">
        <h2 className="font-bold text-xl mb-4 ml-5">Messages</h2>
        <div className="flex items-center py-2 w-full">
          <div className="flex items-center w-full">
            <CiSearch className="relative left-8 text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search"
              value=""
              readOnly
              onClick={() => setShowSearchUserModal(true)}
              className="border dark:border-gray-500 w-[90%] rounded-3xl px-3 pl-10 py-2 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="my-4 relative max-h-[70%] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <ConnectionListSkeleton />
          ) : (
            chatUsers.map((user: User) => (
              <div
                key={user._id}
                className={`flex items-center gap-3 py-3 px-5 cursor-pointer ${
                  user._id === selectChatUser?._id
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }`}
                onClick={() => setSelectChatUser(user)}
              >
                <div className="relative">
                <img
                  src={user?.profilePicture || "/person-demo.jpg"}
                  className="h-10 w-12 rounded-full object-cover"
                  alt="User"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
                </div>
                <div className="flex justify-between w-full">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user.fullname || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500 max-w-[200px] truncate">
                      {messages[user._id]?.[messages[user._id].length - 1].text}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">
                      {getLastMessageDate(messages, user._id)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
          {showSearchModal && (
            <SearchedUsers
              onClose={() => setShowSearchUserModal(false)}
              setSelectChatUser={setSelectChatUser}
              searchedUsers={searchedUsers}
              searchUser={searchUser}
              setSearchUser={setSearchUser}
              searchLoading={searchIsLoading}
            />
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col dark:bg-gray-900 dark:text-white">
        {/* Header */}
        {selectChatUser ? (
          <div className="p-3 w-full z-20 dark:bg-gray-900 bg-white border-b dark:border-b-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                <img
                  src={selectChatUser?.profilePicture || "/person-demo.jpg"}
                  className="h-10 w-10 rounded-full"
                  alt="User"
                />
                {selectChatUser?._id && onlineUsers.includes(selectChatUser._id) && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              <div className="flex flex-col">
                <h2 className="text-base font-semibold">
                  {selectChatUser?.fullname}
                </h2>
                {selectChatUser?._id && onlineUsers.includes(selectChatUser._id) && (
                  <span className="text-xs text-green-500 font-medium">
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-lg dark:text-white">
              Select a user to start chatting
            </h2>
          </div>
        )}

        {/* Messages */}
        {selectChatUser && (
          <MessageArea
            messageRef={messageRef}
            messages={messages}
            selectChatUser={selectChatUser}
          />
        )}

        {/* Message Input */}
        {selectChatUser && (
          <div className="p-4 border-t dark:border-t-gray-600 flex items-center mr-8 ml-4">
            <GrEmoji className="text-xl text-gray-500 mr-3 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none dark:bg-gray-600 dark:border-gray-800"
            />
            <button onClick={sendMessage} className="ml-4">
              <LuSend className="text-xl text-gray-500 dark:text-gray-300 " />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
