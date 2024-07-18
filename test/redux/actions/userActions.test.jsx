import { describe, it, expect, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import configureStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import {
  login,
  refreshToken,
  logout,
} from "../../../src/redux/actions/userActions";
import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE,
  LOGOUT,
} from "../../../src/redux/types";
import { server } from "../../setupTest";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("Auth Actions", () => {
  beforeEach(() => {
    localStorage.clear();
    server.resetHandlers();
  });

  it("login should dispatch LOGIN_SUCCESS on successful login", async () => {
    const store = mockStore({});
    const userData = { token: "fakeToken", refreshToken: "fakeRefreshToken" };

    server.use(
      http.post("https://dummyjson.com/auth/login", async (req) => {
        return HttpResponse.json(userData);
      })
    );

    await store.dispatch(login("testUser", "testPass"));

    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: LOGIN_SUCCESS, payload: userData });
    expect(localStorage.getItem("refreshToken")).toBe("fakeRefreshToken");
  });

  it("login should dispatch LOGIN_FAILURE on failed login", async () => {
    const store = mockStore({});
    const errorData = { message: "Login failed" };

    server.use(
      http.post("https://dummyjson.com/auth/login", async (req) => {
        return HttpResponse.json(errorData, { status: 401 });
      })
    );

    await store.dispatch(login("testUser", "testPass"));

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: LOGIN_FAILURE,
      payload: { message: "Login failed" },
    });
  });

  it("refreshToken should dispatch REFRESH_TOKEN_SUCCESS on successful token refresh", async () => {
    const store = mockStore({});
    const refreshTokenData = {
      token: "newFakeToken",
      refreshToken: "newFakeRefreshToken",
    };

    localStorage.setItem("refreshToken", "oldFakeRefreshToken");

    server.use(
      http.post("https://dummyjson.com/auth/refresh", async (req) => {
        return HttpResponse.json(refreshTokenData);
      })
    );

    await store.dispatch(refreshToken());

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: REFRESH_TOKEN_SUCCESS,
      payload: refreshTokenData,
    });
    expect(localStorage.getItem("refreshToken")).toBe("newFakeRefreshToken");
  });

  it("refreshToken should dispatch REFRESH_TOKEN_FAILURE if no refresh token is available", async () => {
    const store = mockStore({});
    localStorage.removeItem("refreshToken");

    await store.dispatch(refreshToken());

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: REFRESH_TOKEN_FAILURE,
      payload: { message: "No refresh token available" },
    });
  });

  it("refreshToken should dispatch REFRESH_TOKEN_FAILURE on failed token refresh", async () => {
    const store = mockStore({});
    const errorData = { message: "Refresh token failed" };

    localStorage.setItem("refreshToken", "oldFakeRefreshToken");

    server.use(
      http.post("https://dummyjson.com/auth/refresh", async (req) => {
        return HttpResponse.json(errorData, { status: 401 });
      })
    );

    await store.dispatch(refreshToken());

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: REFRESH_TOKEN_FAILURE,
      payload: { message: "Refresh token failed" },
    });
  });

  it("logout should dispatch LOGOUT and remove refreshToken from localStorage", () => {
    const store = mockStore({});
    localStorage.setItem("refreshToken", "fakeRefreshToken");

    store.dispatch(logout());

    const actions = store.getActions();
    expect(actions[0]).toEqual({ type: LOGOUT });
    expect(localStorage.getItem("refreshToken")).toBe(null);
  });
});
