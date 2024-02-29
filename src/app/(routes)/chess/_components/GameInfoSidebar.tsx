"use client";

import { useSocket } from "@/components/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { LeaveGameDialog } from "./LeaveGameDialog";
import { useState } from "react";
import moment from "moment";

export const GameInfoSidebar = () => {
  const [showLeaveGameConfirmation, setShowLeaveGameConfirmation] =
    useState(false);

  const socket = useSocket();
  const { chess } = useStore();

  const isEndedGame = !!chess?.endedAt;

  return (
    <>
      <LeaveGameDialog
        open={showLeaveGameConfirmation}
        setOpen={setShowLeaveGameConfirmation}
      />
      <div className="flex flex-col justify-between col-span-1 border p-4 rounded-lg border-blue-500">
        <div className="space-y-2">
          <p className="font-bold text-gray-600">
            {/* currently user id is shown but we will show username  */}
            Players: {chess?.player1?.userId} & {chess?.player2?.userId}{" "}
          </p>
          {!isEndedGame && (
            <p>
              Turn: {chess?.turn?.toUpperCase()}
              {/* {chess?.player1?.side === chess?.turn ? "Yours" : "Theirs"} */}
            </p>
          )}
          {isEndedGame && <p>Winner: {chess?.winner}</p>}
          <p>Stake: {chess?.stake}</p>
        </div>
        {isEndedGame ? (
          <>
            <p className="pt-6">
              You&apos;re viewing an old game that ended{" "}
              {moment(new Date(chess.endedAt!)).fromNow()}
            </p>
          </>
        ) : (
          <>
            <div className="h-10" />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="default" size="sm" disabled>
                Collect win
              </Button>
              <Button variant="default" size="sm" disabled>
                Collect draw
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowLeaveGameConfirmation(true)}
              >
                Leave Game
              </Button>
              <Button variant="secondary" disabled>
                Avert Game
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
