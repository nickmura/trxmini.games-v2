"use client";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAtom } from "jotai";
import { startGameDialogAtom } from "@/atoms/startGameDialog.atom";
import { useStore } from "@/store";

export const StartGame = () => {
  const { chess } = useStore();
  const [, setShowStartGameDialog] = useAtom(startGameDialogAtom);

  const isLoading = chess === null;
  const isInGameRoom = chess?.roomId;

  return isInGameRoom ? (
    <Button disabled>In a game </Button>
  ) : (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="">Start Game</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Connect tron wallet</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setShowStartGameDialog({ isCloseable: true, isOpen: true });
            }}
          >
            Start a game
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
