import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ProductCard from "../../src/components/ProductCard";
import * as cartActions from "../../src/redux/actions/cartActions";

vi.mock("../../src/components/Toast", () => ({
  __esModule: true,
  default: ({ message, type }) => (
    <div className={`toast ${type}`} data-testid="toast">
      {message}
    </div>
  ),
}));

const mockStore = configureStore([]);

const product = {
  id: 1,
  title: "Test Product",
  price: 100,
  description: "This is a test product description.",
  images: ["test-image.jpg"],
};

describe("ProductCard", () => {
  let store;
  let user;

  beforeEach(() => {
    user = { id: 1, name: "Test User" };
    store = mockStore({
      user: { user },
      cart: { userCart: [] },
    });
    store.dispatch = vi.fn();
    localStorage.clear();
    vi.spyOn(cartActions, "addToCart");
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should render product details", () => {
    render(
      <Provider store={store}>
        <ProductCard product={product} onDetailsClick={vi.fn()} />
      </Provider>
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(
      screen.getByText(/This is a test product description\.\.\./)
    ).toBeInTheDocument();
  });

  it("should handle Add to Cart click for logged-in user", async () => {
    render(
      <Provider store={store}>
        <ProductCard product={product} onDetailsClick={vi.fn()} />
      </Provider>
    );

    await act(async () => {
      fireEvent.click(screen.getByLabelText(`Add Test Product to cart`));
    });

    await waitFor(() => {
      expect(cartActions.addToCart).toHaveBeenCalledWith(product, user.id);
      expect(screen.getByText("Added to cart!")).toBeInTheDocument();
    });
  });

  it("should handle Add to Cart click for guest user", async () => {
    store = mockStore({
      user: { user: null },
      cart: { userCart: [] },
    });

    render(
      <Provider store={store}>
        <ProductCard product={product} onDetailsClick={vi.fn()} />
      </Provider>
    );

    await act(async () => {
      fireEvent.click(screen.getByLabelText(`Add Test Product to cart`));
    });

    await waitFor(() => {
      expect(screen.getByText("Added to cart!")).toBeInTheDocument();
    });

    expect(JSON.parse(localStorage.getItem("cartItems"))).toEqual([
      { ...product, quantity: 1 },
    ]);
  });

  it("should call onDetailsClick when More details is clicked", async () => {
    const onDetailsClick = vi.fn();

    render(
      <Provider store={store}>
        <ProductCard product={product} onDetailsClick={onDetailsClick} />
      </Provider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText("More details"));
    });

    expect(onDetailsClick).toHaveBeenCalledWith(product);
  });
});
