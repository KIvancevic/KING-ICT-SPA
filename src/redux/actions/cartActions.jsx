import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../types";

export const addToCart = (product, userId) => {
  return { type: ADD_TO_CART, payload: product, userId };
};

export const removeFromCart = (productId, userId) => {
  return { type: REMOVE_FROM_CART, payload: productId, userId };
};

export const updateCartQuantity = (productId, quantity, userId) => {
  return {
    type: UPDATE_CART_QUANTITY,
    payload: { id: productId, quantity },
    userId,
  };
};
