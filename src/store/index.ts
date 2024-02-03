import { create } from "zustand";
import { ChessSlice, createChessSlice } from "./chessStore";

export const useStore = create<ChessSlice>()((...a) => ({
  ...createChessSlice(...a),
}));
