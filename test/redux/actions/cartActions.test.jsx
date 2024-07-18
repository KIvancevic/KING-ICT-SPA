import { describe, it, expect } from "vitest";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
} from "../../../src/redux/types";
import {
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "../../../src/redux/actions/cartActions";

describe("Cart Actions", () => {
  it("addToCart should create an action to add a product to the cart", () => {
    const product = { id: 1, name: "Product A", price: 100 };
    const userId = "user1";
    const expectedAction = {
      type: ADD_TO_CART,
      payload: product,
      userId,
    };

    expect(addToCart(product, userId)).toEqual(expectedAction);
  });

  it("removeFromCart should create an action to remove a product from the cart", () => {
    const productId = 1;
    const userId = "user1";
    const expectedAction = {
      type: REMOVE_FROM_CART,
      payload: productId,
      userId,
    };

    expect(removeFromCart(productId, userId)).toEqual(expectedAction);
  });

  it("updateCartQuantity should create an action to update the quantity of a product in the cart", () => {
    const productId = 1;
    const quantity = 2;
    const userId = "user1";
    const expectedAction = {
      type: UPDATE_CART_QUANTITY,
      payload: { id: productId, quantity },
      userId,
    };

    expect(updateCartQuantity(productId, quantity, userId)).toEqual(
      expectedAction
    );
  });
});
