import { create } from "zustand";

interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
}

interface User {
  _id: string;
  fullname: string;
  profilePicture?: string;
}

interface ChatStore {
    selectChatUser:User| null;
    setSelectChatUsers: (user:User)=> void;
    messages: Record<string, Message[]>;
    setMessages:(userId: string, messages: Message[])=> void;
    addMessage:(userId:string,message: Message)=> void;
    setOnline
    onlineUser:string[];
    
}   