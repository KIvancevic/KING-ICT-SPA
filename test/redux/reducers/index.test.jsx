import { describe, it, expect, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../../../src/redux/reducers/index";
import { ADD_TO_CART, LOGIN_SUCCESS } from "../../../src/redux/types";
import { addToCart } from "../../../src/redux/actions/cartActions";
import { login } from "../../../src/redux/actions/userActions";

const initialProductState = {
  categories: [],
  currentPage: 1,
  error: null,
  filter: {
    category: "",
    priceRange: [0, Infinity],
  },
  loading: false,
  products: [],
  productsPerPage: 20,
  searchTerm: "",
  sort: {
    key: "",
    order: "",
  },
  totalProducts: 0,
};

const initialUserState = {
  cart: [],
  error: null,
  refreshToken: null,
  token: null,
  user: null,
};

const initialCartState = { userCart: {} };

describe("rootReducer", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        products: initialProductState,
        user: initialUserState,
        cart: initialCartState,
      },
    });
  });

  it("should initialize with the correct default state", () => {
    const initialState = store.getState();
    expect(initialState).toEqual({
      products: initialProductState,
      user: initialUserState,
      cart: initialCartState,
    });
  });

  it("should handle actions for the product reducer", () => {
    const action = addToCart({ id: "prod1", name: "Product 1" }, "user1");
    store.dispatch(action);

    const state = store.getState();
    expect(state.cart.userCart["user1"]).toEqual([
      { id: "prod1", name: "Product 1", quantity: 1 },
    ]);
  });

  it("should handle actions for the user reducer", () => {
    const action = login("testUser", "testPass");
    store.dispatch(action);

    store.dispatch({
      type: LOGIN_SUCCESS,
      payload: { id: "user1", name: "User 1", refreshToken: "testToken" },
    });

    const state = store.getState();
    expect(state.user.user).toEqual({
      id: "user1",
      name: "User 1",
      refreshToken: "testToken",
    });
  });

  it("should handle actions for the cart reducer", () => {
    const action = addToCart({ id: "item1", name: "Item 1" }, "user1");
    store.dispatch(action);

    const state = store.getState();
    expect(state.cart.userCart["user1"]).toEqual([
      { id: "item1", name: "Item 1", quantity: 1 },
    ]);
  });
});
