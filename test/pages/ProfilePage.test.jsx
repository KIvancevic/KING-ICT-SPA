import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, expect, test, beforeEach, vi } from "vitest";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { thunk } from "redux-thunk";
import { BrowserRouter as Router } from "react-router-dom";
import ProfilePage from "../../src/pages/ProfilePage";
import * as userActions from "../../src/redux/actions/userActions";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

vi.mock("../../src/redux/actions/userActions");

describe("ProfilePage", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        user: null,
        error: null,
      },
    });

    userActions.logout.mockImplementation(() => ({
      type: "LOGOUT",
    }));

    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test("renders profile page with anonymous user", () => {
    render(
      <Provider store={store}>
        <Router>
          <ProfilePage />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/User Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Name: Anonymous/i)).toBeInTheDocument();
    expect(screen.getByText(/Email: Anonymous/i)).toBeInTheDocument();
    expect(screen.getByText(/Your are not logged in/i)).toBeInTheDocument();
    expect(screen.getByTestId("auth-button").textContent).toBe("Log in");
  });

  test("renders profile page with logged in user", () => {
    store = mockStore({
      user: {
        user: { id: 1, firstName: "John", email: "john@example.com" },
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <ProfilePage />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/User Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Name: John/i)).toBeInTheDocument();
    expect(screen.getByText(/Email: john@example.com/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Your are not logged in/i)
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("auth-button").textContent).toBe("Logout");
  });

  test("handles logout", async () => {
    store = mockStore({
      user: {
        user: { id: 1, firstName: "John", email: "john@example.com" },
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <ProfilePage />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByTestId("auth-button"));

    await waitFor(() => {
      expect(userActions.logout).toHaveBeenCalled();
    });
  });

  test("displays error toast when there is an error", () => {
    store = mockStore({
      user: {
        user: null,
        error: { message: "An error occurred" },
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <ProfilePage />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
    expect(screen.getByText(/Your are not logged in/i)).toBeInTheDocument();
  });

  test("displays success toast on successful logout", async () => {
    store = mockStore({
      user: {
        user: { id: 1, firstName: "John", email: "john@example.com" },
        error: null,
      },
    });

    const { rerender } = render(
      <Provider store={store}>
        <Router>
          <ProfilePage />
        </Router>
      </Provider>
    );

    fireEvent.click(screen.getByTestId("auth-button"));

    await waitFor(() => {
      expect(userActions.logout).toHaveBeenCalled();
    });

    act(() => {
      store = mockStore({
        user: {
          user: null,
          error: null,
        },
      });
    });

    rerender(
      <Provider store={store}>
        <Router>
          <ProfilePage />
        </Router>
      </Provider>
    );

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(
        screen.getByText((content, element) =>
          content.startsWith("Successfully logged out!")
        )
      ).toBeInTheDocument();
    });
  });
});
