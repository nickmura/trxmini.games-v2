import { StateCreator } from "zustand";

export interface AuthTokenSlice {
  authToken: string | null;
  setAuthToken: (data: AuthTokenSlice["authToken"]) => void;
}

export const createAuthTokenSlice: StateCreator<
  AuthTokenSlice,
  [],
  [],
  AuthTokenSlice
> = (set) => ({
  authToken: null,
  setAuthToken: (authToken) => {
    set((state) => ({ ...state, authToken }));
  },
});
