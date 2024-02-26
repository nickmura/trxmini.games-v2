"use client";

import { useSocket } from "@/components/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import Link from "next/link";

export const GameInfoSidebar = () => {
  const socket = useSocket();
  const { chess } = useStore();

  return (
    <div className="flex flex-col justify-between col-span-1 border p-4 rounded-lg border-blue-500">
      <div>
        <p className="font-bold text-gray-700">
          {/* currently user id is shown but we will show username  */}
          Players: {chess?.player1?.userId} & {chess?.player2?.userId}{" "}
        </p>
        <p>
          Turn: {chess?.turn?.toUpperCase()}
          {/* {chess?.player1?.side === chess?.turn ? "Yours" : "Theirs"} */}
        </p>
        <p>Stake: {chess?.stake}</p>
      </div>
      <div className="h-10" />
      <div className="grid grid-cols-2 gap-2">
        <Button variant="default" size="sm" disabled>
          Collect win
        </Button>
        <Button variant="default" size="sm" disabled>
          Collect draw
        </Button>
        <Button variant="destructive" size="sm">
          <Link href="/">Leave Game</Link>
        </Button>
        <Button variant="secondary" disabled>
          Avert Game
        </Button>
      </div>
    </div>
  );
};
