"use client";

import { useEffect } from "react";
import { GameInfoSidebar } from "./GameInfoSidebar";
import { Chess } from "./Chess";
import { ChatSidebar } from "./ChatSidebar";
import { useAtom } from "jotai";
import { startGameDialogAtom } from "@/atoms/startGameDialog.atom";
import { useStore } from "@/store";
import { Spinner } from "@/components/ui/spinner";

export const ChessGameWrapper = () => {
  const [, setShowStartGameDialog] = useAtom(startGameDialogAtom);

  const { chess, userSessionStatus } = useStore();

  const isLoading = !chess?.roomId || userSessionStatus === "loading";
  const isInGameRoom = chess?.roomId;

  useEffect(() => {
    if (isLoading) return;
    if (!isInGameRoom) {
      setShowStartGameDialog({
        isCloseable: false,
        isOpen: true,
      });
    } else {
      setShowStartGameDialog({
        isCloseable: false,
        isOpen: false,
      });
    }
  }, [isInGameRoom, isLoading, setShowStartGameDialog]);

  return (
    <>
      <div className={"flex py-8 relative"}>
        {isLoading && (
          <div className="fixed bg-gray-400/40 z-10 inset-0 grid place-items-center">
            <Spinner />
          </div>
        )}
        <div className="basis-1/4">
          <GameInfoSidebar />
        </div>
        <div className="basis-2/4">
          <Chess />
        </div>
        <div className="basis-1/4">
          <ChatSidebar />
        </div>
      </div>
    </>
  );
};
