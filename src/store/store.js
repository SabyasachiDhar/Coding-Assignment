import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../features/appSlice"; // Import the new appSlice

const store = configureStore({
  reducer: {
    app: appReducer, // Use the new app slice
  },
});

export default store;
