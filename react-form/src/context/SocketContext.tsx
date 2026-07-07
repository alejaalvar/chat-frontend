import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./UserContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user, token } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user || !token) return;
    const s = io(SOCKET_URL, { withCredentials: true, auth: { token } });
    setSocket(s);
    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [user?.id, token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
