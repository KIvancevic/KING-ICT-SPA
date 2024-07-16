import { combineReducers } from "@reduxjs/toolkit";
import productReducer from "./productReducer";
import userReducer from "./userReducer";
import cartReducer from "./cartReducer";

const rootReducer = combineReducers({
  products: productReducer,
  user: userReducer,
  cart: cartReducer,
});

export default rootReducer;
