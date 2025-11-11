import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import refreshReducer from "./refresh"

const store = configureStore({
  reducer: {
    user: userReducer,
    refresh:refreshReducer,
  },
});

export default store;