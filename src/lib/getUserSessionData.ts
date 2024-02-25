export const getUserSessionData = async () => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL_BASE}/auth/me`,
      {
        credentials: "include",
      }
    );

    if (response.status === 200) {
      return await response.json();
    }
  } catch (e) {}

  return null;
};
