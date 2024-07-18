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
import Cart from "../../src/pages/Cart";
import * as cartActions from "../../src/redux/actions/cartActions";
import * as cartSelectors from "../../src/redux/selectors/cartSelectors";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

vi.mock("../../src/redux/actions/cartActions", () => ({
  removeFromCart: vi.fn().mockImplementation((id, userId) => {
    return (dispatch) => {
      dispatch({ type: "REMOVE_FROM_CART", payload: { id, userId } });
    };
  }),
}));

describe("Cart", () => {
  let store;
  const mockGetUserCart = vi.fn();

  beforeEach(() => {
    store = mockStore({
      user: { user: { id: 1, name: "testuser" } },
      cart: { userCart: { 1: [] } },
    });

    mockGetUserCart.mockReturnValue([]);
    vi.spyOn(cartSelectors, "makeGetUserCart").mockReturnValue(
      () => mockGetUserCart
    );

    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  test("renders cart with empty message when no items are present", () => {
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
  });

  test("renders cart items when items are present", () => {
    store = mockStore({
      user: { user: { id: 1, name: "testuser" } },
      cart: {
        userCart: {
          1: [
            { id: 1, title: "Item 1", price: 10, images: ["image1.png"] },
            { id: 2, title: "Item 2", price: 20, images: ["image2.png"] },
          ],
        },
      },
    });

    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    expect(screen.getByText(/\$10/i)).toBeInTheDocument();
    expect(screen.getByText(/Item 2/i)).toBeInTheDocument();
    expect(screen.getByText(/\$20/i)).toBeInTheDocument();
  });

  test(
    "removes item from cart on button click",
    async () => {
      store = mockStore({
        user: { user: { id: 1, name: "testuser" } },
        cart: {
          userCart: {
            1: [{ id: 1, title: "Item 1", price: 10, images: ["image1.png"] }],
          },
        },
      });

      render(
        <Provider store={store}>
          <Cart />
        </Provider>
      );

      fireEvent.click(screen.getByRole("button", { name: /Remove/i }));

      await waitFor(() => {
        expect(cartActions.removeFromCart).toHaveBeenCalledWith(1, 1);
        expect(screen.getByText(/Removed from cart!/i)).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(
          screen.queryByText(/Removed from cart!/i)
        ).not.toBeInTheDocument();
      });
    },
    { timeout: 10000 }
  );

  test(
    "shows toast message on item removal",
    async () => {
      store = mockStore({
        user: { user: { id: 1, name: "testuser" } },
        cart: {
          userCart: {
            1: [{ id: 1, title: "Item 1", price: 10, images: ["image1.png"] }],
          },
        },
      });

      render(
        <Provider store={store}>
          <Cart />
        </Provider>
      );

      fireEvent.click(screen.getByRole("button", { name: /Remove/i }));

      await waitFor(() => {
        expect(screen.getByText(/Removed from cart!/i)).toBeInTheDocument();
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(
          screen.queryByText(/Removed from cart!/i)
        ).not.toBeInTheDocument();
      });
    },
    { timeout: 10000 }
  );
});
