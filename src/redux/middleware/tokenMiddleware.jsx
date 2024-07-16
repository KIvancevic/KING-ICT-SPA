import { refreshToken } from "../actions/userActions";
import { jwtDecode } from "jwt-decode"; // Ensure this import is correct

const tokenMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    const state = getState();

    // Check if token exists and is expired
    if (state.user.token && isTokenExpired(state.user.token)) {
      const refreshPromise = dispatch(refreshToken());

      // Handle next action after token is refreshed
      refreshPromise
        .then(() => {
          next(action);
        })
        .catch((error) => {
          console.error("Token refresh failed:", error);
          // Optionally handle refresh failure (e.g., dispatch logout, show notification)
        });
    } else {
      next(action);
    }
  };

const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Math.floor(new Date().getTime() / 1000) >= exp;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true; // Treat invalid tokens as expired
  }
};

export default tokenMiddleware;
