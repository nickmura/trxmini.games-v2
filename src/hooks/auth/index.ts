import { connectTronWallet } from "@/lib/connectTronWallet";
import { getUserSessionData } from "@/lib/getUserSessionData";
import { loginWithAddress } from "@/lib/loginWithAddress";
import { useStore } from "@/store";
import { UserSessionSlice } from "@/store/userSessionStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const useAuth = () => {
  const { setUserSession, setUserSessionStatus, setAuthToken } = useStore();

  const signIn = async () => {
    setUserSessionStatus("loading");

    try {
      const connected = (await connectTronWallet()) as {
        walletAddress: string;
      };

      if (connected) {
        await fetch(`${process.env.BACKEND_API_URL_BASE}/auth`, {
          method: "POST",
          body: JSON.stringify({ username: connected.walletAddress }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const response = await loginWithAddress(connected.walletAddress);

        if (response) {
          setAuthToken(response);
          const sessionData = await getUserSessionData(response);

          if (sessionData) {
            setUserSession(sessionData);
            return setUserSessionStatus("authenticated");
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Couldnt authenticate using your Tron wallet");
    }

    setUserSession(null);
    setUserSessionStatus("unauthenticated");
  };

  return {
    signIn,
  };
};
