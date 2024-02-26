"use client";

import { useSocket } from "@/components/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useStore } from "@/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ChessLobby = () => {
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  const router = useRouter();

  const { chessLobby, userSession } = useStore();

  const isLoading = chessLobby === null;
  const isLobbyEmpty = chessLobby?.length === 0;

  const userId = userSession?.id; // useUserId();
  const socket = useSocket();

  const handleJoinRoom = (roomId: string) => {
    setIsJoiningRoom(true);

    socket?.emit("join:chess:room", {
      roomId,
      userId,
    });

    router.replace(`/chess/${roomId}`);
  };

  return (
    <div>
      {/* <pre>{JSON.stringify(chessLobby, null, 2)}</pre> */}
      <div className="space-y-4 mt-4 pb-8">
        {chessLobby?.map((room) => {
          const isInRoom = room.player1.userId === userId;
          return (
            <div
              key={room.roomId}
              className="flex justify-between items-center border border-gray-300 rounded-lg p-4 w-full hover:border-gray-700 cursor-default transition-all"
            >
              <div>
                <p className="text-gray-400 font-semibold">Game</p>
                <p className="font-semibold text-lg">Chess</p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold">Player 1</p>
                <p className="font-semibold text-lg">
                  {room.player1.userId} ({room.player1.side})
                </p>
              </div>
              <div>
                <p className="text-gray-400 font-semibold">Stake</p>
                <p className="font-semibold text-lg">{room.stake || "-"}</p>
              </div>
              <div>
                <Button
                  disabled={isJoiningRoom || isInRoom}
                  onClick={() => handleJoinRoom(room.roomId)}
                >
                  Join
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {isLoading && (
        <div className="grid place-items-center mt-4">
          <Spinner className="scale-[0.6]" />
        </div>
      )}
      {isLobbyEmpty && (
        <div className="grid place-items-center mt-4">
          <p className="text-gray-700 font-semibold">
            Looks like there&apos;s no available games to join
          </p>
          <p className="text-gray-500 mt-2">
            Click &quot;Start Game&quot; button above to create your own game
            instead
          </p>
        </div>
      )}
    </div>
  );
};
