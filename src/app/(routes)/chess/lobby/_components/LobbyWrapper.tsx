"use client";

import { useSocket } from "@/components/LayoutWrapper";
import { useStore } from "@/store";
import { ReactNode, useEffect } from "react";

export const LobbyWrapper = ({ children }: { children: ReactNode }) => {
  const socket = useSocket();

  const { setChessLobby } = useStore();

  useEffect(() => {
    if (!socket) return;

    socket?.emit("chess:lobby");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket?.on("chess:lobby", (data) => {
      //   console.log("chess:lobby", data);
      setChessLobby(data?.data);
    });
  }, [socket, setChessLobby]);

  return <>{children}</>;
};
