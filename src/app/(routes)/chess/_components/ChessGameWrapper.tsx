"use client";

import { ReactNode, useEffect, useState } from "react";
import { GameInfoSidebar } from "./GameInfoSidebar";
import { Chess } from "./Chess";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/components/LayoutWrapper";
import { useRouter } from "next/navigation";
import { ISocketState } from "../types/index.types";
import { ChatSidebar } from "./ChatSidebar";

export const ChessGameWrapper = ({ children }: { children?: ReactNode }) => {
  const [side, setSide] = useState<"w" | "b">("w");
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState("");
  const [stateFromSocket, setStateFromSocket] = useState<ISocketState>();

  const searchParams = useSearchParams();
  const router = useRouter();

  const socket = useSocket();

  useEffect(() => {
    if (
      searchParams.get("roomId") &&
      searchParams.get("roomId") !== "undefined"
    ) {
      socket?.emit("join:chess:room", {
        roomId: searchParams.get("roomId"),
        userId: searchParams.get("userId"),
      });
    }
  }, [searchParams, socket]);

  useEffect(() => {
    setRoomId(searchParams.get("roomId") || "");
    setUserId(searchParams.get("userId") || "");
  }, [searchParams]);

  useEffect(() => {
    socket?.on("joined:chess", (data) => {
      console.log(data, "data");
      // setGameRoom(data?.data);
      setStateFromSocket(data?.data);

      const url = new URL(window.location.href);

      url.searchParams.set("roomId", data?.data?.roomId);
      url.searchParams.set(
        "userId",
        userId || url.searchParams.get("userId") || ""
      );

      if (data?.data?.player1?.userId === userId) {
        setSide("w");
      } else {
        setSide("b");
      }

      router.replace(url.href);
    });
  }, [router, socket, userId]);

  useEffect(() => {
    socket?.on("update:chess", (data) => {
      console.log(data, "update:chess");
      setStateFromSocket(data);
    });

    return () => {
      socket?.off("update:chess");
    };
  }, [socket]);

  return (
    <div className="flex justify-between p-8">
      <GameInfoSidebar stateFromSocket={stateFromSocket} />
      <div className="col-span-4">
        <Chess
          setStateFromSocket={setStateFromSocket}
          setUserId={setUserId}
          side={side}
          stateFromSocket={stateFromSocket}
        />
      </div>
      <ChatSidebar />
    </div>
  );
};
