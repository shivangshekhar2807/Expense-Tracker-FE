import { createSlice } from "@reduxjs/toolkit";

const refreshSlice = createSlice({
  name: "refresh",
  initialState: null,
  reducers: {
    addRefresh() {
      return Math.random();
    },
  },
});

export const { addRefresh } = refreshSlice.actions;

export default refreshSlice.reducer;
