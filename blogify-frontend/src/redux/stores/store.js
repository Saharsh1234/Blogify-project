import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/users/usersSlice";
import postsReducer from "../slices/posts/postsSlice";
import categoriesReducer from "../slices/categories/categoriesSlice";
import commentReducer from "../slices/comments/commentsSlice";

//! Store

const store = configureStore({
    reducer: {
        users: userReducer,
        posts: postsReducer,
        categories: categoriesReducer,
        comments:commentReducer
    },
});

export default store;