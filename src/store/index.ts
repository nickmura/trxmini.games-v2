import { create } from "zustand";
import { ChessSlice, createChessSlice } from "./chessStore";
import { ChatSlice, createChatSlice } from "./chatStore";
import { UserSessionSlice, createUserSessionSlice } from "./userSessionStore";
import { AuthTokenSlice, createAuthTokenSlice } from "./authTokenStore";
import { persist, createJSONStorage } from "zustand/middleware";

export const useStore = create<
  ChessSlice & ChatSlice & UserSessionSlice & AuthTokenSlice
>()(
  persist(
    (...a) => ({
      ...createChessSlice(...a),
      ...createChatSlice(...a),
      ...createUserSessionSlice(...a),
      ...createAuthTokenSlice(...a),
    }),
    {
      name: "trxmini.games-store",
      partialize: (state) =>
        Object.fromEntries(
          // only persist authToken in localStorage
          Object.entries(state).filter(([key]) => ["authToken"].includes(key))
        ),
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// useStore.
