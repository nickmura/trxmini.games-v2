import { create } from "zustand";
import { ChessSlice, createChessSlice } from "./chessStore";
import { ChatSlice, createChatSlice } from "./chatStore";
import { UserSessionSlice, createUserSessionSlice } from "./userSessionStore";

export const useStore = create<ChessSlice & ChatSlice & UserSessionSlice>()(
  (...a) => ({
    ...createChessSlice(...a),
    ...createChatSlice(...a),
    ...createUserSessionSlice(...a),
  })
);
