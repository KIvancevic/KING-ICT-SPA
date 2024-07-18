import { jwtDecode } from "jwt-decode";
import { refreshToken } from "../actions/userActions";

const tokenMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    const state = getState();

    if (state.user.token && isTokenExpired(state.user.token)) {
      const refreshPromise = dispatch(refreshToken());

      refreshPromise
        .then(() => {
          next(action);
        })
        .catch((error) => {
          console.error("Token refresh failed:", error);
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
    return true;
  }
};

export default tokenMiddleware;
