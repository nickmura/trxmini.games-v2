export const getUserSessionData = async (bearerToken: string) => {
  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL_BASE}/auth/me`,
      {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (response.status === 200) {
      return await response.json();
    }
  } catch (e) {}

  return null;
};
