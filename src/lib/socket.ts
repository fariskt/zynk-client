import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL_SOCKET, {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });
  }
  return socket;
};
