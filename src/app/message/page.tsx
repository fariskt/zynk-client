"use client";

import useAuthStore from "@/src/store/useAuthStore";
import { useSearchUsers } from "@/src/hooks/useUser";
import AxiosInstance from "@/src/lib/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { LuSend } from "react-icons/lu";
import { GrEmoji } from "react-icons/gr";
import { getLastMessageDate } from "@/src/utils/DateFormater/DateFormat";
import MessageArea from "@/src/components/Chat/MessageArea";
import ConnectionListSkeleton from "@/src/utils/SkeltonUi/ConnectionListSkelton";
import SearchedUsers from "@/src/components/Chat/SearchedUsers";
import { useChatStore } from "@/src/store/useChatStore";
import { User } from "@/src/types";
import { getSocket } from "@/src/lib/socket";
import { IoMdArrowBack } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";

interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string | Date;
}

const ChatApp = () => {
  const socket = getSocket();

  const { user } = useAuthStore();

  const {
    selectChatUser,
    setSelectChatUser,
    messages,
    setMessages,
    addMessage,
    onlineUsers,
    setOnlineUsers,
  } = useChatStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatUsers, setChatUsers] = useState<User[]>([]);
  const [searchUser, setSearchUser] = useState<string>("");
  const [newMessage, setNewMessage] = useState<string>("");
  const [showSearchModal, setShowSearchUserModal] = useState<boolean>(false);
  const messageRef = useRef<HTMLDivElement | null>(null);

  const { data: searchedUsers, isLoading: searchIsLoading } =
    useSearchUsers(searchUser);

  useEffect(() => {
    if (!user?._id) return;

    const handleReceiveMessage = (message: Message) => {
      const chatId =
        message.senderId === user._id ? message.receiverId : message.senderId;
      addMessage(chatId, {
        ...message,
        timestamp: message.timestamp ?? new Date(),
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [user?._id, addMessage]);

  // ✅ Handle user connection status
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("user_connected", user._id);

    const handleOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.emit("user_disconnected", user._id);
      socket.off("online_users", handleOnlineUsers);
    };
  }, [user?._id, setOnlineUsers]);

  // Fetch all chat users
  useEffect(() => {
    const fetchChatUsers = async () => {
      setIsLoading(true);
      if (!user?._id) return;

      try {
        const response = await AxiosInstance.get(`/chat/chats/${user._id}`);
        const chatUsers = response.data;
        setChatUsers(chatUsers);
        setIsLoading(false);

        const messagesMap = await Promise.all(
          chatUsers.map(async (chatUser: User) => {
            const res = await AxiosInstance.get(
              `/chat/chat/${user._id}?otherUserId=${chatUser._id}`
            );
            return { userId: chatUser._id, messages: res.data.messages || [] };
          })
        );

        // ✅ Call setMessages for each user
        messagesMap.forEach(({ userId, messages }) => {
          setMessages(userId, messages);
        });
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching chat users:", error);
      }
    };

    fetchChatUsers();
  }, [user?._id, setMessages]);

  useEffect(() => {
    if (!user?._id || !selectChatUser?._id) return;

    const fetchSingleChat = async () => {
      try {
        const response = await AxiosInstance.get(
          `/chat/chat/${user._id}?otherUserId=${selectChatUser._id}`
        );

        setMessages(selectChatUser._id, response.data.messages);
      } catch (error) {
        console.error("Error fetching single chat:", error);
      }
    };

    fetchSingleChat();
  }, [selectChatUser, user?._id, setMessages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectChatUser || !user?._id) return;

    const messageData: Message = {
      senderId: user._id,
      receiverId: selectChatUser._id,
      text: newMessage,
      timestamp: new Date(),
    };

    // Emit via socket.io
    socket.emit("send_message", messageData);

    // ✅ Update messages state
    addMessage(selectChatUser._id, messageData);

    // ✅ Update chatUsers with recent chat on top
    setChatUsers((prevChatUsers) => {
      const existingUser = prevChatUsers.find(
        (chatUser) => chatUser._id === selectChatUser._id
      );

      const updatedUsers = existingUser
        ? [
            existingUser,
            ...prevChatUsers.filter((user) => user._id !== selectChatUser._id),
          ]
        : [selectChatUser, ...prevChatUsers];

      return updatedUsers;
    });

    setNewMessage("");
  };

  return (
    <div className="h-screen  fixed md:w-[95%] w-full flex md:ml-20 md:mt-16">
      <div
        className={`${
          selectChatUser ? "hidden md:block" : "block"
        } md:w-1/4 w-full border-r border-l border-gray-300 dark:bg-gray-900 dark:border-gray-800 pt-8 dark:text-white`}
      >
        <div className="flex items-center ml-4">
          <Link href="/">
            <span className="text-xl md:hidden block">
              <IoMdArrowBack />
            </span>
          </Link>
          <h2 className="font-bold text-xl md:mb-4 ml-5">Messages</h2>
        </div>
        <div className="flex items-center py-2 w-full md:mt-0 mt-5">
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
          ) : chatUsers.length > 0 ? (
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
                  <Image
                  height={40}
                  width={48}
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
          ) : (
            <h2 className="text-center">No chats yet</h2>
          )}
          {showSearchModal && (
            <SearchedUsers
              onClose={() => setShowSearchUserModal(false)}
              searchedUsers={searchedUsers}
              searchUser={searchUser}
              setSearchUser={setSearchUser}
              searchLoading={searchIsLoading}
            />
          )}
        </div>
      </div>

      <div
        className={`${
          selectChatUser ? "absolute md:static w-full md:w-auto" : "hidden md:block"
        } flex-1 flex flex-col dark:bg-gray-900 dark:text-white`}
      >
        {selectChatUser ? (
          <div className="p-3 w-full z-20 dark:bg-gray-900 bg-white border-b dark:border-b-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-3 relative">
              <span className="md:hidden block text-xl z-10" onClick={()=> setSelectChatUser(null)}><IoMdArrowBack/></span>
              <div className="relative">
                <Image
                height={40}
                width={40}
                  src={selectChatUser?.profilePicture || "/person-demo.jpg"}
                  className="h-10 w-10 rounded-full"
                  alt="User"
                />
                {selectChatUser?._id &&
                  onlineUsers.includes(selectChatUser._id) && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                  )}
              </div>

              <div className="flex flex-col">
                <h2 className="text-base font-semibold">
                  {selectChatUser?.fullname}
                </h2>
                {selectChatUser?._id &&
                  onlineUsers.includes(selectChatUser._id) && (
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

        {selectChatUser && (
          <MessageArea
            messageRef={messageRef}
            messages={messages}
            selectChatUser={selectChatUser}
          />
        )}

        {selectChatUser && (
          <div className="p-4 border-t dark:border-t-gray-600 flex items-center md:mr-8 md:ml-4">
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
