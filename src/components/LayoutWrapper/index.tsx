"use client";

import { Provider, atom, useAtom } from "jotai";
import { ReactNode, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { Dialogs } from "../Dialogs";
import { useStore } from "@/store";
import { ISocketState } from "@/app/(routes)/chess/types/index.types";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { getUserSessionData } from "@/lib/getUserSessionData";

const _socketAtom = atom<Socket | null>(null);
// const _userIdAtom = atom<string | null | undefined | number>(undefined);

export const useSocket = () => {
  const [socket] = useAtom(_socketAtom);
  return socket;
};

/**
 * @desc temporary hook to get a non changing userId stored in browser's localstorage
 * @returns {String} userid of current user
 */
// export const useUserId = () => {
//   const [userId] = useAtom(_userIdAtom);
//   return userId;
// };

export const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const pathname = usePathname();
  const params = useParams();

  // console.log(params);

  const [socket, setSocket] = useAtom(_socketAtom);
  // const [userId, setUserId] = useAtom(_userIdAtom);
  const {
    userSession,
    authToken,
    setChess,
    setSide,
    setUserSession,
    setUserSessionStatus,
  } = useStore();

  // useAuth();

  // useEffect(() => {
  //   console.log("ran");
  //   const storedUserId = localStorage?.getItem("__temp__trxmini.games--userId");

  //   if (storedUserId === null) {
  //     const generatedUserId = Math.floor(Math.random() * 1_000_000_000 + 1);
  //     localStorage.setItem(
  //       "__temp__trxmini.games--userId",
  //       generatedUserId as unknown as string
  //     );
  //     setUserId(generatedUserId);
  //   } else {
  //     setUserId(storedUserId);
  //   }
  // }, [setUserId]);

  useEffect(() => {
    const socket = io(process.env.SOCKET_URL!, {
      transports: ["websocket"],
      // withCredentials: true,
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

        const url = new URL(window.location.origin);
        url.pathname = `/chess/${data.data.roomId}`;
        // url.searchParams.set("roomId", data.data.roomId);

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

        // const url = new URL(window.location.href);
        const url = new URL(window.location.origin);
        url.pathname = `/chess/${data.data.roomId}`;

        const userId = userSession?.id; // url.searchParams.get("userId");

        // url.searchParams.set("roomId", data?.data?.roomId);

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
  }, [router, socket, userSession?.id, setChess, setSide]);

  useEffect(() => {
    if (!socket) return;

    // const url = new URL(window.location.href);

    const userId = userSession?.id; // searchParams.get("userId");
    const roomId = params.roomId;

    if (userId && roomId) {
      //set chess to null if we are emitting join:chess:room to show loading spinner
      setChess(null);
      socket?.emit("join:chess:room", { roomId, userId });
    } else {
      // shows game join dialog on /chess route
      setChess({} as ISocketState);
    }
  }, [socket, userSession?.id, setChess, searchParams, params.roomId]);

  useEffect(() => {
    socket?.on("update:chess", (data) => {
      // console.log(data, "update:chess");
      setChess(data);
    });

    return () => {
      socket?.off("update:chess");
    };
  }, [socket, setChess]);

  useEffect(() => {
    if (!authToken) return setUserSessionStatus("unauthenticated");
    // check if current user is loggedin
    // and set session data & status accordingly
    (async () => {
      const data = await getUserSessionData(authToken);
      setUserSession(data);

      if (data) {
        setUserSessionStatus("authenticated");
      } else {
        setUserSessionStatus("unauthenticated");
      }
    })();
  }, [authToken, setUserSessionStatus, setUserSession]);

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
