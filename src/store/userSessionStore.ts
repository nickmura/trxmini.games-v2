import { StateCreator } from "zustand";

export interface UserSessionSlice {
  userSession: {
    id: string;
    nickname: null | string;
    createdAt: Date;
  } | null;
  userSessionStatus: "loading" | "authenticated" | "unauthenticated";
  setUserSession: (data: UserSessionSlice["userSession"]) => void;
  setUserSessionStatus: (data: UserSessionSlice["userSessionStatus"]) => void;
}

export const createUserSessionSlice: StateCreator<
  UserSessionSlice,
  [],
  [],
  UserSessionSlice
> = (set) => ({
  userSession: null,
  setUserSession: (userSession) => {
    set((state) => ({ ...state, userSession }));
  },
  userSessionStatus: "loading",
  setUserSessionStatus: (userSessionStatus) => {
    set((state) => ({ ...state, userSessionStatus }));
  },
});
