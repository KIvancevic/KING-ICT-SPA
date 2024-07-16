import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE,
  LOGOUT,
  FETCH_CART,
} from "../types";

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  cart: [],
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload,
        user: null,
        token: null,
        refreshToken: null,
        cart: [],
      };
    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        error: null,
      };
    case REFRESH_TOKEN_FAILURE:
      return { ...state, error: action.payload };
    case LOGOUT:
      return {
        ...initialState,
        error: null,
      };
    case FETCH_CART:
      return {
        ...state,
        cart: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
