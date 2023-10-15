import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetErrorAction, resetSuccessAction } from "../globalSlice/globalSlice";

//initialstate
const INITIAL_STATE = {
  loading: false,
  error: null,
  comments: [],
  comment: null,
  success: false,
};

// ! update post
export const createCommentAction = createAsyncThunk(
  "comment/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Autherization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:9080/api/v1/comments/${payload?.postId}`,
        {
          message: payload?.message,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//! post slices
const postSlice = createSlice({
  name: "posts",
  initialState: INITIAL_STATE,
  extraReducers: (builder) => {
    //create comment
    //handling pending state
    builder.addCase(createCommentAction.pending, (state, action) => {
      state.loading = true;
    });

    //handling fulfiled state
    builder.addCase(createCommentAction.fulfilled, (state, action) => {
      state.comment = action.payload;
      state.loading = false;
      state.error = null;
      state.success = true;
    });

    //handling rejected state
    builder.addCase(createCommentAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    //! Reset error action
    builder.addCase(resetErrorAction.fulfilled, (state) => {
      state.error = null;
    });
    //! Reset success action
    builder.addCase(resetSuccessAction.fulfilled, (state) => {
      state.success = false;
    });
  },
});

//! generate reducer
const commentReducer = postSlice.reducer;

export default commentReducer;
