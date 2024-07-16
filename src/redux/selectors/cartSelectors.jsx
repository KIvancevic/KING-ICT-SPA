import { createSelector } from "reselect";

const getUserCartState = (state) => state.cart.userCart;

const getUserId = (_, userId) => userId;

export const makeGetUserCart = () =>
  createSelector(
    [getUserCartState, getUserId],
    (userCart, userId) => userCart[userId] || []
  );
