export const loginWithAddress = async (walletAddress: string) => {
  const res = await fetch(`${process.env.BACKEND_API_URL_BASE}/auth/login`, {
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

  const json = await res.json();

  // console.log(json, "json");

  if (json?.token) {
    return json?.token;
  }

  return null;
};
