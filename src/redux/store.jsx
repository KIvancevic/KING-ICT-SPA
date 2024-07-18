import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import tokenMiddleware from "./middleware/tokenMiddleware";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokenMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
