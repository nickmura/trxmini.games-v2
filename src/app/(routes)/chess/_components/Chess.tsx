"use client";
import React, { useState, useMemo, forwardRef, CSSProperties } from "react";
import { Chessboard } from "react-chessboard";
import { Chess as ChessJS, Square } from "chess.js";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomSquareProps } from "react-chessboard/dist/chessboard/types";
import { useSocket } from "@/components/LayoutWrapper";
import { useStore } from "@/store";

export const Chess = () => {
  const chessJs = useMemo(() => new ChessJS(), []); // <- 1
  const [over, setOver] = useState("");

  const searchParams = useSearchParams();
  const [optionSquares, setOptionSquares] = useState({});

  const socket = useSocket();

  const { side, chess, setChess } = useStore();

  const handleDrop = (sourceSquare: Square, targetSquare: Square) => {
    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity
    };

    try {
      // console.log(stateFromSocket?.fen);
      if (chess?.fen) {
        chessJs.load(chess?.fen);
        chessJs.move(moveData);
        setChess({ ...chess, fen: chessJs.fen() });
      }
    } catch (e) {
      console.log(e, "err");
    }

    try {
      socket?.emit("update:chess", {
        roomId: chess?.roomId,
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
    if (chess?.turn !== side) return;

    const moves = chessJs.moves({
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
          chessJs.get(move.to) &&
          chessJs.get(move.to).color !== chessJs.get(square).color
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

  const isLoading = chess === null;
  const isInGameRoom = chess?.roomId;

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

  // console.log(chess, "chess");

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
      <div className="w-[520px] h-[520px] grid place-items-center bg-gradient-to-br from-[#D0A97A] via-[#D0A97A] to-[#A37C4D] relative rounded-lg">
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
        <div className="">
          <Chessboard
            arePiecesDraggable={chess?.turn === side}
            position={chess?.fen}
            onPieceDrop={handleDrop}
            boardWidth={500}
            showBoardNotation
            boardOrientation={side === "w" ? "white" : "black"}
            isDraggablePiece={({ piece }) => {
              if (piece?.startsWith(chess?.turn || "")) return true;
              return false;
            }}
            customSquareStyles={{
              ...optionSquares,
            }}
            onSquareClick={getMoveOptions}
            onPieceDragBegin={(p, s) => getMoveOptions(s)}
            onPieceClick={(p) => {
              console.log(p);
            }}

            // customSquare={(props) => (
            //   <CustomSquareRenderer
            //     {...props}
            //     isCheck={chess.isCheck()}
            //     kingPosition={checkedSquare}
            //   />
            // )}
          />
        </div>
      </div>
      {isInGameRoom ? (
        <>
          {/* {!chess.isGameOver() && ( */}
          <>{chess.turn === side ? "Your turn" : "Their turn"}</>
          {/* )} */}
        </>
      ) : (
        <></>
        // <div>{/* <Button onClick={joinGame}>Join a game</Button> */}</div>
      )}
      {/* {isInGameRoom && (
        <div>
          <div>
            Player 1 {chess?.player1.isConnected ? "online" : "offline"}
          </div>
          <div>
            Player 2 {chess?.player2.isConnected ? "online" : "offline"}
          </div>
        </div>
      )} */}
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
