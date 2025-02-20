import { format } from "date-fns"; // Install with: npm install date-fns

interface Message {
    senderId: string;
    receiverId: string;
    text: string;
    timestamp?: Date | string;
  }
  
  type MessagesState = Record<string, Message[]>

 export const getLastMessageDate = (messagesMap: MessagesState, userId:string) => {
    const userMessages = messagesMap[userId] || []; // Ensure it's an array
    if (!Array.isArray(userMessages) || userMessages.length === 0) return "No messages";    
  
    const latestTimestamp = Math.max(
      ...userMessages.map((msg) => new Date(msg.timestamp||"").getTime())
    );
    const date = new Date(latestTimestamp);
  
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday`;
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

export const formatMessageDate = (timestamp: Date| string) => {
  if (!timestamp) return "";

  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear();

  const isYesterday =
    messageDate.getDate() === yesterday.getDate() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getFullYear() === yesterday.getFullYear();

  if (isToday) return format(messageDate, "hh:mm a"); // Show time (e.g., "10:30 AM")
  if (isYesterday) return "Yesterday"; // Show "Yesterday"
  return format(messageDate, "MMM dd"); // Show date (e.g., "Feb 15, 2025")
};

export const getRelativeTime = (dateString: string) => {
    const postDate = new Date(dateString);
    const diffMs = new Date().getTime() - postDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };
