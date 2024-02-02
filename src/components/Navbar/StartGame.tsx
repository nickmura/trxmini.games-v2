"use client";

import { useState } from "react";
import { StartGameDialog } from "../Dialogs/StartGameDialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const StartGame = () => {
  const [showStartGameDialog, setShowStartGameDialog] = useState(false);

  return (
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
              setShowStartGameDialog(true);
            }}
          >
            Start a game
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <StartGameDialog
        open={showStartGameDialog}
        setOpen={setShowStartGameDialog}
      />
    </>
  );
};
