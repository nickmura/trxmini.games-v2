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
import Link from "next/link";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/hooks/auth";

export const StartGame = () => {
  const { chess, userSession, userSessionStatus } = useStore();
  const [, setShowStartGameDialog] = useAtom(startGameDialogAtom);

  const { signIn } = useAuth();

  const isInGameRoom = chess?.roomId;
  const isAuthenticated = userSessionStatus === "authenticated";

  console.log({ userSession, userSessionStatus });

  return isInGameRoom ? (
    <Button disabled>In a game </Button>
  ) : (
    <>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              {userSessionStatus === "loading" ? (
                <span>
                  <Spinner className="fill-white h-10 stroke-1" />
                </span>
              ) : (
                <>{isAuthenticated ? "Start Game" : "Login with Tron"}</>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {isAuthenticated ? (
              <>
                <p
                  title={userSession?.walletAddress}
                  className="text-sm px-2 py-1 font-semibold text-gray-400 m"
                >
                  {userSession?.walletAddress.slice(0, 6)}
                  ...
                  {userSession?.walletAddress.slice(-6)}
                </p>
              </>
            ) : (
              <DropdownMenuItem onClick={signIn}>
                Connect tron wallet
              </DropdownMenuItem>
            )}
            {isAuthenticated && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setShowStartGameDialog({ isCloseable: true, isOpen: true });
                  }}
                >
                  Start a game
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/chess/lobby">
          <Button variant="outline">Game lobby</Button>
        </Link>
      </div>
    </>
  );
};
