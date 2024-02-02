"use client";
import React, {
  useState,
  useMemo,
  forwardRef,
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";
import { Chessboard } from "react-chessboard";
import { Chess as ChessJS, Square } from "chess.js";
import { useSearchParams } from "next/navigation";
import { StalemateDialog } from "./StalemateDialog";
import { CheckmateDialog } from "./CheckmateDialog";
import { Button } from "@/components/ui/button";
import { CustomSquareProps } from "react-chessboard/dist/chessboard/types";
import { useSocket } from "@/components/LayoutWrapper";
import { ISocketState } from "../types/index.types";

export const Chess = ({
  stateFromSocket,
  setStateFromSocket,
  setUserId,
  side,
}: {
  stateFromSocket: ISocketState | undefined;
  setStateFromSocket: Dispatch<SetStateAction<ISocketState | undefined>>;
  setUserId: Dispatch<SetStateAction<string>>;
  side: "w" | "b";
}) => {
  const chess = useMemo(() => new ChessJS(), []); // <- 1
  const [over, setOver] = useState("");

  const searchParams = useSearchParams();
  const [optionSquares, setOptionSquares] = useState({});

  const socket = useSocket();

  const joinGame = () => {
    // console.log("joining game");
    let userId = searchParams.get("userId");

    if (!userId) {
      do {
        userId = prompt("Enter a user id");
      } while (!userId);
    }

    setUserId(userId!);

    socket?.emit("join:chess", { userId });
  };

  const handleDrop = (sourceSquare: Square, targetSquare: Square) => {
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity
    };

    try {
      // console.log(stateFromSocket?.fen);
      if (stateFromSocket?.fen) {
        chess.load(stateFromSocket?.fen);
        chess.move(moveData);
        setStateFromSocket((prev) => {
          if (!prev) return prev;
          return { ...prev, fen: chess.fen() };
        });
      }
    } catch (e) {
      console.log(e, "err");
    }

    try {
      socket?.emit("update:chess", {
        roomId: stateFromSocket?.roomId,
        userId: searchParams.get("userId"),
        move: moveData,
        // chessState: chess.fen(),
      });
    } catch (e) {
      return false;
    }

    return true;
  };

  function getMoveOptions(square: Square) {
    const moves = chess.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: Record<string, CSSProperties> = {};

    moves.map((move) => {
      newSquares[move.to] = {
        background:
          chess.get(move.to) &&
          chess.get(move.to).color !== chess.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  const isInGameRoom = stateFromSocket?.roomId;

  // const checkedSquare = // useMemo(
  // () =>
  // chess
  //   .board()
  //   .flat()
  //   .find(
  //     (chessPiece) =>
  //       chessPiece?.type === "k" && chessPiece?.color === chess.turn()
  //   )?.square;
  //   [chess]
  // );

  return (
    <div className="grid place-items-center">
      {/* <StalemateDialog
        open={chess.isStalemate()}
        won={chess.turn() !== playerInfo.side}
      />
      <CheckmateDialog
        open={chess.isCheckmate()}
        // open={true}
        won={chess.turn() !== playerInfo.side}
      /> */}
      <div className="w-[500px] relative">
        {over && (
          <div className="absolute inset-0 bg-black/40 z-10 grid place-items-center">
            <div className="font-bold text-white">
              <div>{over}</div>
              <div className="grid place-items-center mt-4">
                <Button>Start a new game</Button>
              </div>
            </div>
          </div>
        )}
        {/* {isInGameRoom && ( */}
        <Chessboard
          arePiecesDraggable={
            // !chess.isGameOver() || chess.turn() === stateFromSocket?.turn
            stateFromSocket?.turn === side
          }
          position={stateFromSocket?.fen}
          onPieceDrop={handleDrop}
          boardWidth={500}
          showBoardNotation
          boardOrientation={side === "w" ? "white" : "black"}
          isDraggablePiece={({ piece }) => {
            if (piece?.startsWith(stateFromSocket?.turn || "")) return true;
            return false;
          }}
          customSquareStyles={{
            ...optionSquares,
          }}
          onSquareClick={getMoveOptions}
          onPieceDragBegin={(p, s) => getMoveOptions(s)}
          // customSquare={(props) => (
          //   <CustomSquareRenderer
          //     {...props}
          //     isCheck={chess.isCheck()}
          //     kingPosition={checkedSquare}
          //   />
          // )}
        />
        {/* )} */}
      </div>
      {isInGameRoom ? (
        <>
          {/* {!chess.isGameOver() && ( */}
          <>{stateFromSocket.turn === side ? "Your turn" : "Their turn"}</>
          {/* )} */}
        </>
      ) : (
        <></>
        // <div>{/* <Button onClick={joinGame}>Join a game</Button> */}</div>
      )}
      {isInGameRoom && (
        <div>
          <div>
            Player 1{" "}
            {stateFromSocket?.player1.isConnected ? "online" : "offline"}
          </div>
          <div>
            Player 2{" "}
            {stateFromSocket?.player2.isConnected ? "online" : "offline"}
          </div>
        </div>
      )}
      {/* <div><pre>{JSON.stringify(gameRoom, null, 2)}</pre></div> */}
    </div>
  );
};

const CustomSquareRenderer = forwardRef<
  HTMLDivElement,
  CustomSquareProps & { isCheck: boolean; kingPosition?: Square }
>((props, ref) => {
  // console.log(props.isCheck, props.kingPosition, "props");
  const { children, square, squareColor, style } = props;

  return (
    <div
      ref={ref}
      style={{
        ...style,
        position: "relative",
        backgroundColor:
          props.isCheck && square === props.kingPosition
            ? "red"
            : (style.backgroundColor as string),
      }}
    >
      {children}
    </div>
  );
});

CustomSquareRenderer.displayName = "CustomSquareRenderer";
