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

// export const eventAPI = "https://146.190.244.186:5020/api";
export const eventAPI =
  "https://nile.trongrid.io/v1/transactions/80ba83dbcd72f60326a6363aa9f2624095f5f6d8e14d73a3dccacdc028f46d98/events";

export const StartGame = () => {
  const { chess, userSession, userSessionStatus } = useStore();
  const [, setShowStartGameDialog] = useAtom(startGameDialogAtom);

  const { signIn } = useAuth();

  const isInGameRoom = chess?.roomId;
  const isAuthenticated = userSessionStatus === "authenticated";

  // const handleStartGame = async () => {
  //   const room = { index: undefined };
  //   let counter = 0;
  //   // if (room.stake != '0') {
  //   while (
  //     (room.index == "" && counter < 5000) ||
  //     (room.index == undefined && counter < 5000)
  //   ) {
  //     counter++;
  //     let events;
  //     const res = await fetch(eventAPI);
  //     console.log(res, "Res");
  //     if (res) {
  //       events = await res.json();
  //       console.log(events, "events");
  //       break;
  //     }
  //     // let event = events.data.find((event :any) => event?.result._gameId == uuid.toString())
  //     // room.index = event?.result.index;
  //   }
  //   // }
  //   console.log(counter);
  // };

  // console.log({ userSession, userSessionStatus });

  return isInGameRoom ? (
    <Button disabled>In a game </Button>
  ) : (
    <>
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={userSessionStatus === "loading"}>
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
                  title={userSession?.id}
                  className="text-sm px-2 py-1 font-semibold text-gray-400 m"
                >
                  {userSession?.id.slice(0, 6)}
                  ...
                  {userSession?.id.slice(-6)}
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
                    // handleStartGame();
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
