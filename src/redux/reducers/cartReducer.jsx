import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_QUANTITY } from "../types";

const initialState = {
  userCart: {},
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      if (action.userId) {
        const userCart = state.userCart[action.userId] || [];
        const isItemInCart = userCart.some(
          (item) => item.id === action.payload.id
        );

        const updatedUserCart = isItemInCart
          ? userCart.map((item) =>
              item.id === action.payload.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...userCart, { ...action.payload, quantity: 1 }];

        return {
          ...state,
          userCart: { ...state.userCart, [action.userId]: updatedUserCart },
        };
      } else {
        return state;
      }

    case REMOVE_FROM_CART:
      if (action.userId) {
        const userCart = state.userCart[action.userId] || [];
        const updatedUserCart = userCart.filter(
          (item) => item.id !== action.payload
        );

        return {
          ...state,
          userCart: { ...state.userCart, [action.userId]: updatedUserCart },
        };
      } else {
        return state;
      }

    case UPDATE_CART_QUANTITY:
      if (action.userId) {
        const userCart = state.userCart[action.userId] || [];
        const modifiedUserCart = userCart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );

        return {
          ...state,
          userCart: { ...state.userCart, [action.userId]: modifiedUserCart },
        };
      } else {
        return state;
      }

    default:
      return state;
  }
};

export default cartReducer;
