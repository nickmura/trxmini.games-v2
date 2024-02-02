"use client";

import { atom, useAtom } from "jotai";
import { ReactNode, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { Dialogs } from "../Dialogs";

const _socketAtom = atom<Socket | null>(null);

export const useSocket = () => {
  const [socket] = useAtom(_socketAtom);
  return socket;
};

export const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const [, setSocket] = useAtom(_socketAtom);

  useEffect(() => {
    const socket = io(process.env.SOCKET_URL!, {
      // path: "/",
      transports: ["websocket"],
    });

    setSocket(socket);

    // console.log(socket);
    return () => {
      socket.close();
      setSocket(null);
    };
  }, [setSocket]);

  return (
    <>
      <Dialogs />
      {children}
    </>
  );
};
