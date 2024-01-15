"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
// import Chessboard from "chessboardjsx";
import { Chessboard } from "react-chessboard";
import { Chess as ChessJS, Piece, Square } from "chess.js";

export const Chess = ({}) => {
  const chess = useMemo(() => new ChessJS(), []); // <- 1
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const [over, setOver] = useState("");
  // const [game, setGame] = useState(new Chess());

  // useEffect(() => {
  //   socket.on('move', (move) => {
  //     handleMove(move);
  //   });

  //   return () => {
  //     socket.off('move');
  //   };
  // }, [socket]);

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

    // if (isValidMove(move)) {
    //   socket.emit("move", move);
    //   handleMove(move);
    // }

    const move = makeAMove(moveData);

    // illegal move
    if (move === null) return false;

    return true;
  };

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

  // const isValidMove = (move) => {
  //   try {
  //     const updatedGame = new Chess().move(move);
  //     console.log(updatedGame);
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // };

  // const highlightSquareStyle = (square) => {
  //   if (selectedSquare === square) {
  //     return { backgroundColor: "deepskyblue" };
  //   } else if (
  //     selectedSquare &&
  //     isValidMove({ from: selectedSquare, to: square })
  //   ) {
  //     return { backgroundColor: "lightgreen" };
  //   }
  //   return {};
  // };

  console.log(chess, "chess");

  // const isValidMove = (move) => {
  //   const updatedGame = new Chess(game.fen());
  //   console.log(updatedGame);
  //   const moves = updatedGame.legalMoves();
  //   return moves.some((m) => move.from + move.to === m);
  // };

  return (
    <div className="grid place-items-center h-screen">
      <div className="w-[500px]">
        <Chessboard
          arePiecesDraggable={true}
          position={fen}
          onPieceDrop={handleDrop}
          boardWidth={500}
          areArrowsAllowed
          onPieceClick={(piece) =>
            console.log(chess.moves(), piece, chess.history())
          }
          showBoardNotation

          // customSquare={(...props) => {
          //   console.log(props);
          //   return <div></div>;
          // }}
        />
      </div>
      {chess?.turn() === "w" ? <>White&apos;s turn</> : <>B lack&apos;s turn</>}
    </div>
  );
};
