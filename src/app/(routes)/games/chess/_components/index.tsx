"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
// import Chessboard from "chessboardjsx";
import { Chessboard } from "react-chessboard";
import { Chess as ChessJS, Piece, Square } from "chess.js";
import { Socket, io } from "socket.io-client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Chess = ({}) => {
  const chess = useMemo(() => new ChessJS(), []); // <- 1
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const [over, setOver] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null); // const [game, setGame] = useState(new Chess());
  const [gameRoom, setGameRoom] = useState({
    roomId: "",
    player1: "",
    player2: "",
  });

  const [playerInfo, setPlayerInfo] = useState({
    side: "w",
    roomId: "",
    userId: "",
    username: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const makeAMove = useCallback(
    (move: { from: string; to: string; promotion: string }) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // update fen state to trigger a re-render

        // console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());

        if (chess.isGameOver()) {
          // check if move led to "game over"
          if (chess.isCheckmate()) {
            // if reason for game over is a checkmate
            // Set message to checkmate.
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            );
            // The winner is determined by checking which side made the last move
          } else if (chess.isDraw()) {
            // if it is a draw
            setOver("Draw"); // set message to "Draw"
          } else {
            setOver("Game over");
          }
        }

        return result;
      } catch (e) {
        console.log(e, "e");
        return null;
      } // null if the move was illegal, the move object if the move was legal
    },
    [chess]
  );

  // useEffect(() => {
  //   socket.on('move', (move) => {
  //     handleMove(move);
  //   });

  //   return () => {
  //     socket.off('move');
  //   };
  // }, [socket]);
  useEffect(() => {
    const socket = io(process.env.SOCKET_URL!, {
      // path: "/",
      transports: ["websocket"],
    });

    setSocket(socket);

    socket.on("update:chess", (data) => {
      console.log(data, "update:chess");
      makeAMove(data);
    });

    // console.log(socket);

    return () => {
      socket.close();
      setSocket(null);
    };
  }, [router, makeAMove]);

  useEffect(() => {
    if (
      searchParams.get("roomId") &&
      searchParams.get("roomId") !== "undefined" &&
      !gameRoom.roomId
    ) {
      console.log("emitting join:chess:room", {
        roomId: searchParams.get("roomId"),
        userId: searchParams.get("userId"),
      });
      socket?.emit("join:chess:room", {
        roomId: searchParams.get("roomId"),
        userId: searchParams.get("userId"),
      });
    }
  }, [searchParams, gameRoom, socket]);

  useEffect(() => {
    setPlayerInfo((prev) => ({
      ...prev,
      roomId: searchParams.get("roomId") || "",
      userId: searchParams.get("userId") || "",
    }));
  }, [searchParams]);

  useEffect(() => {
    socket?.on("joined:chess", (data) => {
      console.log(data, "data");
      setGameRoom(data?.data);

      const url = new URL(window.location.href);

      url.searchParams.set("roomId", data?.data?.roomId);
      url.searchParams.set(
        "userId",
        playerInfo.userId || url.searchParams.get("userId") || ""
      );

      if (data?.data?.player1 === playerInfo.userId) {
        setPlayerInfo((prev) => ({
          ...prev,
          side: "w",
        }));
      } else {
        setPlayerInfo((prev) => ({
          ...prev,
          side: "b",
        }));
      }

      if (data?.data?.chessState) {
        chess.load(data?.data?.chessState);
        setFen(chess.fen());
      }

      router.replace(url.href);
    });
  }, [playerInfo.userId, router, socket, chess]);

  const joinGame = () => {
    // console.log("joining game");
    let userId = searchParams.get("userId");

    if (!userId) {
      do {
        userId = prompt("Enter a user id");
      } while (!userId);
    }

    setPlayerInfo((prev) => ({
      ...prev,
      userId: userId!,
    }));

    socket?.emit("join:chess", { userId });
  };

  // const handleMove = (move) => {
  //   const updatedGame = new Chess(game.fen());
  //   updatedGame.move(move);
  //   setGame(updatedGame);
  // };

  const handleDrop = (sourceSquare: Square, targetSquare: Square) => {
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity
    };

    // return false;

    // if (isValidMove(move)) {
    //   socket.emit("move", move);
    //   handleMove(move);
    // }

    const move = makeAMove(moveData);

    // illegal move
    if (move === null) return false;

    socket?.emit("update:chess", {
      roomId: gameRoom.roomId,
      player: searchParams.get("userId"),
      move: moveData,
      chessState: chess.fen(),
    });

    return true;
  };

  const isInGameRoom = gameRoom.roomId;

  console.log({ playerInfo });

  return (
    <div className="grid place-items-center h-screen">
      {over}
      <div className="w-[500px]">
        {isInGameRoom && (
          <Chessboard
            arePiecesDraggable={chess.turn() === playerInfo.side}
            position={fen}
            onPieceDrop={handleDrop}
            boardWidth={500}
            showBoardNotation
            boardOrientation={playerInfo.side === "w" ? "white" : "black"}
            isDraggablePiece={({ piece }) => {
              if (piece?.startsWith(playerInfo.side)) return true;
              return false;
            }}
          />
        )}
      </div>
      {isInGameRoom ? (
        <>{chess.turn() === playerInfo.side ? "Your turn" : "Their turn"}</>
      ) : (
        <div>
          <button onClick={joinGame}>Join a game</button>
        </div>
      )}
      <div>{/* <pre>{JSON.stringify(gameRoom, null, 2)}</pre> */}</div>
    </div>
  );
};
