import { describe, it, expect } from "vitest";
import userReducer from "../../../src/redux/reducers/userReducer";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE,
  LOGOUT,
  FETCH_CART,
} from "../../../src/redux/types";

describe("userReducer", () => {
  const initialState = {
    user: null,
    token: null,
    refreshToken: null,
    cart: [],
    error: null,
  };

  it("should return the initial state", () => {
    expect(userReducer(undefined, {})).toEqual(initialState);
  });

  it("should handle LOGIN_SUCCESS", () => {
    const action = {
      type: LOGIN_SUCCESS,
      payload: {
        id: 1,
        name: "User",
        token: "token123",
        refreshToken: "refreshToken123",
      },
    };

    const expectedState = {
      ...initialState,
      user: action.payload,
      token: action.payload.token,
      refreshToken: action.payload.refreshToken,
      error: null,
    };

    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle LOGIN_FAILURE", () => {
    const action = {
      type: LOGIN_FAILURE,
      payload: "Login failed",
    };

    const expectedState = {
      ...initialState,
      error: action.payload,
      user: null,
      token: null,
      refreshToken: null,
      cart: [],
    };

    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle REFRESH_TOKEN_SUCCESS", () => {
    const action = {
      type: REFRESH_TOKEN_SUCCESS,
      payload: {
        token: "newToken123",
        refreshToken: "newRefreshToken123",
      },
    };

    const expectedState = {
      ...initialState,
      token: action.payload.token,
      refreshToken: action.payload.refreshToken,
      error: null,
    };

    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle REFRESH_TOKEN_FAILURE", () => {
    const action = {
      type: REFRESH_TOKEN_FAILURE,
      payload: "Token refresh failed",
    };

    const expectedState = {
      ...initialState,
      error: action.payload,
    };

    expect(userReducer(initialState, action)).toEqual(expectedState);
  });

  it("should handle LOGOUT", () => {
    const state = {
      user: { id: 1, name: "User" },
      token: "token123",
      refreshToken: "refreshToken123",
      cart: [{ id: 1, name: "Product 1" }],
      error: null,
    };

    const action = { type: LOGOUT };

    const expectedState = {
      ...initialState,
      error: null,
    };

    expect(userReducer(state, action)).toEqual(expectedState);
  });

  it("should handle FETCH_CART", () => {
    const action = {
      type: FETCH_CART,
      payload: [{ id: 1, name: "Product 1" }],
    };

    const expectedState = {
      ...initialState,
      cart: action.payload,
    };

    expect(userReducer(initialState, action)).toEqual(expectedState);
  });
});
