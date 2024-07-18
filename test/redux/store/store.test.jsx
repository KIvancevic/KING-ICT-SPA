import { describe, it, expect, vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../../../src/redux/reducers";
import tokenMiddleware from "../../../src/redux/middleware/tokenMiddleware";

describe("Redux Store", () => {
  it("should configure the store with the rootReducer and middleware", () => {
    const mockMiddleware = (storeAPI) => (next) => (action) => {
      if (action.type === "TEST_ACTION") {
        return "mockMiddleware";
      }
      return next(action);
    };

    const mockMiddlewareSpy = vi.fn(mockMiddleware);

    const store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tokenMiddleware, mockMiddlewareSpy),
      devTools: process.env.NODE_ENV !== "production",
    });

    const state = store.getState();

    expect(state).toEqual(rootReducer(undefined, { type: "@@INIT" }));

    store.dispatch({ type: "TEST_ACTION" });

    expect(mockMiddlewareSpy).toHaveBeenCalled();

    expect(store).toHaveProperty("dispatch");
    expect(store).toHaveProperty("getState");
    expect(store).toHaveProperty("subscribe");
    expect(store).toHaveProperty("replaceReducer");
  });
});
