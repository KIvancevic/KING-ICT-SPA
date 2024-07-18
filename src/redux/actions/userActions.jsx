import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE,
  LOGOUT,
} from "../types";

export const login = (username, password) => async (dispatch) => {
  try {
    const response = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("refreshToken", data.refreshToken);
      dispatch({ type: LOGIN_SUCCESS, payload: data });
    } else {
      dispatch({
        type: LOGIN_FAILURE,
        payload: { message: data.message || "Login failed" },
      });
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: { message: error.message || "Network error" },
    });
  }
};

export const refreshToken = () => async (dispatch) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      dispatch({
        type: REFRESH_TOKEN_FAILURE,
        payload: { message: "No refresh token available" },
      });
      return;
    }

    const response = await fetch("https://dummyjson.com/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("refreshToken", data.refreshToken);
      dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: data });
    } else {
      dispatch({
        type: REFRESH_TOKEN_FAILURE,
        payload: { message: data.message || "Refresh token failed" },
      });
    }
  } catch (error) {
    dispatch({
      type: REFRESH_TOKEN_FAILURE,
      payload: { message: error.message || "Network error" },
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("refreshToken");
  dispatch({ type: LOGOUT });
};
