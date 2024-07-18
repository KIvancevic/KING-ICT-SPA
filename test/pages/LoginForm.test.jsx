import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { BrowserRouter as Router } from "react-router-dom";
import LoginForm from "../../src/pages/LoginForm";
import * as userActions from "../../src/redux/actions/userActions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

vi.mock("../../src/redux/actions/userActions", () => ({
  login: vi.fn().mockImplementation((username, password) => {
    return async (dispatch) => {
      dispatch({ type: "LOGIN_REQUEST" });
      if (username === "testuser" && password === "password123") {
        dispatch({ type: "LOGIN_SUCCESS", payload: { username } });
      } else {
        dispatch({ type: "LOGIN_FAILURE", error: { message: "Login failed" } });
      }
    };
  }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginForm", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { error: null, user: null },
    });
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test("renders login form", () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginForm />
        </Router>
      </Provider>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  test("shows validation errors if form is submitted empty", async () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginForm />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    expect(
      await screen.findByText(/Username is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Password is required/i)
    ).toBeInTheDocument();
  });

  test("dispatches login action with correct parameters", async () => {
    render(
      <Provider store={store}>
        <Router>
          <LoginForm />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(userActions.login).toHaveBeenCalledWith("testuser", "password123");
    });
  });

  test("displays error message on login failure", async () => {
    store = mockStore({
      user: { error: { message: "Login failed" }, user: null },
    });

    render(
      <Provider store={store}>
        <Router>
          <LoginForm />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });

  test(
    "navigates to home on successful login",
    async () => {
      store = mockStore({
        user: { error: null, user: { username: "testuser" } },
      });

      const { rerender } = render(
        <Provider store={store}>
          <Router>
            <LoginForm />
          </Router>
        </Provider>
      );

      await act(async () => {
        store.dispatch({
          type: "LOGIN_SUCCESS",
          payload: { username: "testuser" },
        });

        rerender(
          <Provider store={store}>
            <Router>
              <LoginForm />
            </Router>
          </Provider>
        );
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    },
    { timeout: 5000 }
  );
});
