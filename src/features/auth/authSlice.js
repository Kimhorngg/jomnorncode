import { createSlice } from "@reduxjs/toolkit";

const parseStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "null" || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const normalizeStoredToken = () => {
  const raw = localStorage.getItem("token");
  if (!raw || raw === "null" || raw === "undefined") return null;
  return raw;
};

const storedToken = normalizeStoredToken();
const storedUser = parseStoredUser();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    token: storedToken || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload || {};
      const safeToken =
        typeof token === "string" && token !== "null" && token !== "undefined" && token.trim()
          ? token
          : null;
      const safeUser = user || null;

      state.user = safeUser;
      state.token = safeToken;

      if (safeToken) localStorage.setItem("token", safeToken);
      else localStorage.removeItem("token");

      if (safeUser) localStorage.setItem("user", JSON.stringify(safeUser));
      else localStorage.removeItem("user");
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
