"use client";

import { useSocket } from "@/components/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { ISocketState } from "../types/index.types";

export const GameInfoSidebar = ({
  stateFromSocket,
}: {
  stateFromSocket: ISocketState | undefined;
}) => {
  const socket = useSocket();

  //   console.log(socket, "socket");
  return (
    <div className="flex flex-col justify-between col-span-1 border p-4 rounded-lg border-blue-500">
      <div>
        <p className="font-bold text-gray-700">
          {/* currently user id is shown but we will show username  */}
          Players: {stateFromSocket?.player1?.userId}{" "}
          {stateFromSocket?.player2?.userId}{" "}
        </p>
        <p>
          Current Turn:{" "}
          {stateFromSocket?.player1?.side === stateFromSocket?.turn
            ? "Yours"
            : "Theirs"}
        </p>
        <p>Stake: 0</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="default" size="sm" disabled>
          Collect win
        </Button>
        <Button variant="default" size="sm" disabled>
          Collect draw
        </Button>
        <Button variant="destructive" size="sm">
          Leave Game
        </Button>
        <Button variant="secondary" disabled>
          Avert Game
        </Button>
      </div>
    </div>
  );
};
