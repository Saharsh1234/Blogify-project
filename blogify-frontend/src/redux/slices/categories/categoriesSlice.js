import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { resetErrorAction, resetSuccessAction } from "../globalSlice/globalSlice";

//initial state                        
const INITIAL_STATE = {
    loading: false,
    error: null,
    categories: [],
    category: null,
    success: false,
};

//! Fetch categories

export const fetchCategoriesAction = createAsyncThunk("categories/lists",
    async (payload, { rejectWithValue, getState, dispatch }) => {

        //make request 

        try {
            const { data } = await axios.get(
                "http://localhost:9080/api/v1/category/",            // need to switch to 9080 according to the server (for both login and register)

            );

            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);            // used the optional chaining operator to avoid the use of and operator

        }
    }
);

//! Users Slices
const categoriesSlice = createSlice({
    name: "posts",
    initialState: INITIAL_STATE,
    extraReducers: (builder) => {                                            //extra reducers is used to handle all the actions that is coming in inside this slices and to update the initial state
        //fetch categories
        builder.addCase(fetchCategoriesAction.pending, (state, action) => {               // builder is to update the individual state 
            state.loading = true;

        });
        // handle the fulfilled state 
        builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });

        //*Handle the rejected state
        builder.addCase(fetchCategoriesAction.rejected, (state, action) => {

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

const categoriesReducer = categoriesSlice.reducer;

export default categoriesReducer;