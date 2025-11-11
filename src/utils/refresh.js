import { createSlice } from "@reduxjs/toolkit";

const refreshSlice = createSlice({
  name: "refresh",
  initialState: null,
  reducers: {
    addRefresh(state, action) {
      return action.payload;
    },
  },
});

export const { addRefresh } = refreshSlice.actions;

export default refreshSlice.reducer;
