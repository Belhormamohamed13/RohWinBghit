import { io, Socket } from "socket.io-client";

import { getAccessToken } from "../utils/authTokenStorage";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;

  const url =
    (import.meta.env.VITE_SOCKET_URL as string | undefined) ??
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    "http://localhost:4000";

  socket = io(url, {
    transports: ["websocket"],
    autoConnect: true,
    withCredentials: true,
    auth: (cb) => {
      const token = getAccessToken();
      cb({ token });
    }
  });

  return socket;
}

