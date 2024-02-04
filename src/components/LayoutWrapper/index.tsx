"use client";

import { Provider, atom, useAtom } from "jotai";
import { ReactNode, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { Dialogs } from "../Dialogs";
import { useStore } from "@/store";
import { ISocketState } from "@/app/(routes)/chess/types/index.types";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { jotaiStore } from "@/atoms";

const _socketAtom = atom<Socket | null>(null);
const _userIdAtom = atom<string | null | undefined | number>(undefined);

export const useSocket = () => {
  const [socket] = useAtom(_socketAtom);
  return socket;
};

/**
 * @desc temporary hook to get a non changing userId stored in browser's localstorage
 * @returns {String} userid of current user
 */
export const useUserId = () => {
  const [userId] = useAtom(_userIdAtom);
  return userId;
};

export const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [socket, setSocket] = useAtom(_socketAtom);
  const [userId, setUserId] = useAtom(_userIdAtom);
  const { setChess, setSide } = useStore();

  useEffect(() => {
    console.log("ran");
    const storedUserId = localStorage?.getItem("__temp__trxmini.games--userId");

    if (storedUserId === null) {
      const generatedUserId = Math.floor(Math.random() * 1_000_000_000 + 1);
      localStorage.setItem(
        "__temp__trxmini.games--userId",
        generatedUserId as unknown as string
      );
      setUserId(generatedUserId);
    } else {
      setUserId(storedUserId);
    }
  }, [setUserId]);

  useEffect(() => {
    const socket = io(process.env.SOCKET_URL!, {
      transports: ["websocket"],
    });

    setSocket(socket);

    return () => {
      socket.close();
      setSocket(null);
    };
  }, [setSocket]);

  useEffect(() => {
    // console.log(socket, "socket");
    if (!socket) return;

    socket?.on(
      "created:chess-room",
      (data: { message: string; data: ISocketState }) => {
        toast.dismiss("create:chess-room");
        toast.success(data.message);

        const url = new URL(window.location.href);
        url.searchParams.set("roomId", data.data.roomId);

        router.push(url.toString());
      }
    );

    return () => {
      socket?.off("created:chess-room");
    };
  }, [socket, router]);

  useEffect(() => {
    if (!socket) return;

    socket?.on(
      "joined:chess",
      (data: { message: string; data: ISocketState }) => {
        setChess(data?.data);

        const url = new URL(window.location.href);

        const userId = url.searchParams.get("userId");

        url.searchParams.set("roomId", data?.data?.roomId);

        if (data?.data?.player1?.userId === userId) {
          setSide("w");
        } else {
          setSide("b");
        }

        router.replace(url.toString());
      }
    );

    return () => {
      socket?.off("joined:chess");
    };
  }, [router, socket, setChess, setSide]);

  useEffect(() => {
    if (!socket) return;

    // const url = new URL(window.location.href);

    const userId = searchParams.get("userId");
    const roomId = searchParams.get("roomId");

    if (userId && roomId) {
      //set chess to null if we are emitting join:chess:room to show loading spinner
      setChess(null);
      socket?.emit("join:chess:room", { roomId, userId });
    } else {
      // shows game join dialog on /chess route
      setChess({} as ISocketState);
    }
  }, [socket, setChess, searchParams]);

  useEffect(() => {
    socket?.on("update:chess", (data) => {
      // console.log(data, "update:chess");
      setChess(data);
    });

    return () => {
      socket?.off("update:chess");
    };
  }, [socket, setChess]);

  return (
    <>
      {/* <Provider store={jotaiStore}> */}
      <Toaster />
      <Dialogs />
      {children}
      {/* </Provider> */}
    </>
  );
};
