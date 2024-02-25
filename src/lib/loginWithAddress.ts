export const loginWithAddress = async (walletAddress: string) => {
  return await fetch(`${process.env.BACKEND_API_URL_BASE}/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      username: walletAddress,
      password: walletAddress,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};
