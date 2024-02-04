import { IChat } from "@/app/(routes)/chess/types/index.types";
import { StateCreator } from "zustand";
import { ChessSlice } from "./chessStore";

export interface ChatSlice {
  chats: Array<IChat> | null;
  setChats: (data: ChatSlice["chats"]) => void;
}

export const createChatSlice: StateCreator<ChatSlice, [], [], ChatSlice> = (
  set
) => ({
  chats: null,
  setChats: (chats) => {
    set((state) => ({ ...state, chats }));
  },
});
