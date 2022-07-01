import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// define a type for the slice state
interface CounterState {
  value: number;
}

// define a type for the slice state
const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incerementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incerementByAmount } =
  counterSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;
export default counterSlice.reducer;
