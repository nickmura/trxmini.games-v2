import { IChessRoomState } from "@/app/(routes)/chess/types/index.types";
import { Socket } from "socket.io-client";
import { create, StateCreator } from "zustand";

export interface ChessSlice {
  side: "w" | "b";
  setSide: (data: ChessSlice["side"]) => void;
  chess: IChessRoomState | null;
  setChess: (data: ChessSlice["chess"]) => void;
  chessLobby: Array<IChessRoomState> | null;
  setChessLobby: (data: ChessSlice["chessLobby"]) => void;
  leaveChessRoom: () => void;
  updateChessRoom: () => void;
}

export const createChessSlice: StateCreator<ChessSlice, [], [], ChessSlice> = (
  set
) => ({
  side: "w",
  setSide: (side) => {
    set((state) => ({ ...state, side }));
  },
  chess: null,
  setChess: (chess) => {
    set((state) => ({ ...state, chess }));
  },
  chessLobby: null,
  setChessLobby: (chessLobby) => {
    set((state) => ({ ...state, chessLobby }));
  },
  // socket?.emit("chess:join", data);
  leaveChessRoom: () => {}, //set((state) => ({ fishes: state.fishes - 1 })),
  updateChessRoom: () => {}, //set((state) => ({ fishes: state.fishes - 1 })),
});
