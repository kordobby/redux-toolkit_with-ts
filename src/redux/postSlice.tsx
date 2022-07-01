import { createSlice } from "@reduxjs/toolkit";

export type PostState = {
  lists: [];
};

export const postSlice = createSlice({
  name: "post",
  initialState: {
    lists: [],
  },
  reducers: {
    // add action
    addPost: function (state: PostState, { type: string, payload: object }) {
      state.lists.push(payload);
    },
    // delete action
    deletePost: function (state, { type, payload }) {
      state.lists = state.lists.filter((value) => value.id !== payload.id);
    },
    updatePost: function (state, { type, payload }) {
      state.lists.forEach((value) => {
        if (value.id === payload.id) {
          value.title = payload.title;
          value.description = payload.description;
        }
      });
    },
  },
});

export const { addPost, deletePost, updatePost } = postSlice.actions;

export default postSlice.reducer;
