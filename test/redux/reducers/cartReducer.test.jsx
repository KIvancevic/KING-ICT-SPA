import { describe, it, expect } from "vitest";
import cartReducer from "../../../src/redux/reducers/cartReducer";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
} from "../../../src/redux/types";

describe("cartReducer", () => {
  const initialState = {
    userCart: {},
  };

  it("should return the initial state", () => {
    expect(cartReducer(undefined, {})).toEqual(initialState);
  });

  it("should handle ADD_TO_CART", () => {
    const action = {
      type: ADD_TO_CART,
      userId: "user1",
      payload: { id: "item1", name: "Item 1" },
    };

    const expectedState = {
      userCart: {
        user1: [{ id: "item1", name: "Item 1", quantity: 1 }],
      },
    };

    expect(cartReducer(initialState, action)).toEqual(expectedState);

    const newState = cartReducer(expectedState, action);
    const expectedUpdatedState = {
      userCart: {
        user1: [{ id: "item1", name: "Item 1", quantity: 2 }],
      },
    };
    expect(newState).toEqual(expectedUpdatedState);
  });

  it("should handle REMOVE_FROM_CART", () => {
    const stateWithItem = {
      userCart: {
        user1: [{ id: "item1", name: "Item 1", quantity: 2 }],
      },
    };

    const action = {
      type: REMOVE_FROM_CART,
      userId: "user1",
      payload: "item1",
    };

    const expectedState = {
      userCart: {
        user1: [],
      },
    };

    expect(cartReducer(stateWithItem, action)).toEqual(expectedState);
  });

  it("should handle UPDATE_CART_QUANTITY", () => {
    const stateWithItem = {
      userCart: {
        user1: [{ id: "item1", name: "Item 1", quantity: 2 }],
      },
    };

    const action = {
      type: UPDATE_CART_QUANTITY,
      userId: "user1",
      payload: { id: "item1", quantity: 5 },
    };

    const expectedState = {
      userCart: {
        user1: [{ id: "item1", name: "Item 1", quantity: 5 }],
      },
    };

    expect(cartReducer(stateWithItem, action)).toEqual(expectedState);
  });
});
