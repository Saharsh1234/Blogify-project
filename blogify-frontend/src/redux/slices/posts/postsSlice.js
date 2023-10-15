import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { resetErrorAction, resetSuccessAction } from "../globalSlice/globalSlice";

//initial state                        
const INITIAL_STATE = {
    loading: false,
    error: null,
    posts: [],
    post: null,
    success: false
};

// Fetch Public Posts
export const fetchPublicPostsAction = createAsyncThunk("posts/fetch-public-posts",
    async (payload, { rejectWithValue, getState, dispatch }) => {

        //make request 

        try {
            const { data } = await axios.get(
                "http://localhost:9080/api/v1/posts/public",

            );

            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);

        }
    }
);

//Fetch post list
export const fetchPrivatePostsAction = createAsyncThunk("posts/fetch-private-posts",
    async ({ page = 1, limit = 2, searchTerm = "", category = "" }, { rejectWithValue, getState, dispatch }) => {

        //make request 

        try {

            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            }
            const { data } = await axios.get(
                `http://localhost:9080/api/v1/postspage=${page}&limit=${limit}&searchTerm=${searchTerm}&category=${category}`,
                config
            );

            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);

        }
    }
);

//create post
export const addPostAction = createAsyncThunk(
    "post/create",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {

            //convert the payload to formdata
            //const formData = new FormData();
            //formData.append("title", payload?.title);
            //formData.append("content", payload?.content);
            //formData.append("categoryId", payload?.category);
            //formData.append("file", payload?.image)
            //const { data } = await axios.post(`${BASE_URL}/posts`, formData, config);

            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            //make request
            const { data } = await axios.post(
                "http://localhost:9080/api/v1/posts",
                payload,
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//fetch single  posts
export const getPostAction = createAsyncThunk(
    "posts/get-post",
    async (postId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const { data } = await axios.get(
                `http://localhost:9080/api/v1/posts/${postId}`
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//like post
export const likePostAction = createAsyncThunk(
    "posts/like",
    async (postId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            }
            const { data } = await axios.put(
                `http://localhost:9080/api/v1/posts/likes/${postId}`,
                {},
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//dislike
export const dislikePostAction = createAsyncThunk(
    "posts/dislike",
    async (postId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            }
            const { data } = await axios.put(
                `http://localhost:9080/api/v1/posts/dislikes/${postId}`,
                {},
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//post views
export const postViewsCounttAction = createAsyncThunk(
    "posts/post-views",
    async (postId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:9080/api/v1/posts/${postId}/post-view-count`,
                {},
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);


//Post Slices
const publicPostsSlice = createSlice({
    name: "posts",
    initialState: INITIAL_STATE,
    extraReducers: (builder) => {                                            //extra reducers is used to handle all the actions that is coming in inside this slices and to update the initial state
        //fetching public post
        //handeling the pending state
        builder.addCase(fetchPublicPostsAction.pending, (state, action) => {
            state.loading = true;

        });
        // handle the fulfilled state 
        builder.addCase(fetchPublicPostsAction.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false;
            state.error = null;
        });
        //Handle the rejected state
        builder.addCase(fetchPublicPostsAction.rejected, (state, action) => {

            state.error = action.payload;
            state.loading = false;
        });

        //fetching private post
        //handeling the pending state
        builder.addCase(fetchPrivatePostsAction.pending, (state, action) => {
            state.loading = true;

        });
        // handle the fulfilled state 
        builder.addCase(fetchPrivatePostsAction.fulfilled, (state, action) => {
            state.posts = action.payload;
            state.loading = false;
            state.error = null;
        });
        //Handle the rejected state
        builder.addCase(fetchPrivatePostsAction.rejected, (state, action) => {

            state.error = action.payload;
            state.loading = false;
        });

        //creating post
        //handling pending action
        builder.addCase(addPostAction.pending, (state, action) => {
            state.loading = true;
        });
        //handling fulfilled state
        builder.addCase(addPostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //handling rejected state
        builder.addCase(addPostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //get one post
        //handling pending state
        builder.addCase(getPostAction.pending, (state, action) => {
            state.loading = true;
        });
        //handling fulfilled state
        builder.addCase(getPostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.loading = false;
            state.error = null;
        });
        //handling rejected state
        builder.addCase(getPostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //like post
        //handling pending state
        builder.addCase(likePostAction.pending, (state, action) => {
            state.loading = true;
        });
        //handling fulfilled state
        builder.addCase(likePostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.loading = false;
            state.error = null;
        });
        //handling rejected state
        builder.addCase(likePostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //dislike post
        //handling pending state
        builder.addCase(dislikePostAction.pending, (state, action) => {
            state.loading = true;
        });
        //handling fulfilled state
        builder.addCase(dislikePostAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.loading = false;
            state.error = null;
        });
        //handling rejected state
        builder.addCase(dislikePostAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //viewing post
        //handling pending state
        builder.addCase(postViewsCounttAction.pending, (state, action) => {
            state.loading = true;
        });
        //handling fulfilled state
        builder.addCase(postViewsCounttAction.fulfilled, (state, action) => {
            state.post = action.payload;
            state.loading = false;
            state.error = null;
        });
        //handling rejected state
        builder.addCase(postViewsCounttAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });


        //! Reset Error Action
        builder.addCase(resetErrorAction.fulfilled, (state) => {
            state.error = null;
        });

        //! Reset Success Action
        builder.addCase(resetSuccessAction.fulfilled, (state) => {
            state.success = false;
        });
    },
})

//! generate reducer

const postsReducer = publicPostsSlice.reducer;

export default postsReducer;