import { create } from "zustand";
import { ChessSlice, createChessSlice } from "./chessStore";
import { ChatSlice, createChatSlice } from "./chatStore";

export const useStore = create<ChessSlice & ChatSlice>()((...a) => ({
  ...createChessSlice(...a),
  ...createChatSlice(...a),
}));
