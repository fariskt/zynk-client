import { create } from "zustand";
import { User } from "../types";

interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string| Date;
}

interface ChatStore {
    selectChatUser:User| null;
    setSelectChatUser: (user:User)=> void;
    messages: Record<string, Message[]>;
    setMessages:(userId: string, messages: Message[])=> void;
    addMessage:(userId:string,message: Message)=> void;
    setOnlineUsers:(users:string[])=> void;
    onlineUsers:string[];
}   

export const useChatStore =create<ChatStore>((set)=> ({
    selectChatUser: null,
    setSelectChatUser:(user)=> {
        set({selectChatUser: user})
    },
    messages: {},
    setMessages: (userId, messages)=> {
        set((state)=> ({
            messages: {...state.messages, [userId]:messages},
        }))
    },
    addMessage: (userId, message)=> {
        set((state)=> ({
            messages:{
                ...state.messages,
                [userId]: [...(state.messages[userId] || []), message]
            }
        }))
    },
    onlineUsers: [],
    setOnlineUsers: (users)=> {
        set({onlineUsers: users})
    }
}))