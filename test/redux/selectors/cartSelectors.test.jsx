import { describe, it, expect } from "vitest";
import { makeGetUserCart } from "../../../src/redux/selectors/cartSelectors";

describe("makeGetUserCart Selector", () => {
  it("should return the correct cart for the given userId", () => {
    const state = {
      cart: {
        userCart: {
          user1: ["item1", "item2"],
          user2: ["item3", "item4"],
        },
      },
    };

    const userId = "user1";
    const expectedCart = ["item1", "item2"];

    const getUserCart = makeGetUserCart();
    const result = getUserCart(state, userId);

    expect(result).toEqual(expectedCart);
  });

  it("should return an empty array if the user has no items in the cart", () => {
    const state = {
      cart: {
        userCart: {
          user1: ["item1", "item2"],
          user2: ["item3", "item4"],
        },
      },
    };

    const userId = "user3";
    const expectedCart = [];

    const getUserCart = makeGetUserCart();
    const result = getUserCart(state, userId);

    expect(result).toEqual(expectedCart);
  });
});
