import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { resetErrorAction, resetSuccessAction } from "../globalSlice/globalSlice";

//intial state of the features related to user(features such as login or register)
const INITIAL_STATE = {
    loading: false,
    error: null,
    users: [],
    user: null,
    success: false,
    isVerified: false,
    emailMessage: undefined,
    isEmailSent: false,
    profile: {},
    userAuth: {
        error: false,
        userInfo: localStorage.getItem("userInfo") ?
            JSON.parse(localStorage.getItem("userInfo"))
            : null,
    },
};

// dispatch function for Login action,this action will be dispatched 
export const loginAction = createAsyncThunk("users/login",
    async (payload, { rejectWithValue, getState, dispatch }) => {

        //make request 
        try {
            const { data } = await axios.post(
                "http://localhost:9080/api/v1/users/login",
                payload
            );
            // save the user to local storage
            localStorage.setItem('userInfo', JSON.stringify(data))
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);

        }
    }
);

//dispatch function for registrartion
export const registerAction = createAsyncThunk("users/register",
    async (payload, { rejectWithValue, getState, dispatch }) => {

        //make request 

        try {
            const { data } = await axios.post(
                "http://localhost:9080/api/v1/users/register",            // need to switch to 9080 according to the server (for both login and register)
                payload
            );

            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);

        }
    }
);

// Logout Action
export const logoutaction = createAsyncThunk("users/logout", async () => {
    // remove token from local storage 
    localStorage.removeItem("userInfo");
    return true;
});

//public user profile action
export const userPublicProfileAction = createAsyncThunk(
    "users/user-public-profile",
    async (userId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(
                `http://localhost:9080/api/v1/users/public-profile/${userId}`,
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//private user profile action
export const userPrivateProfileAction = createAsyncThunk(
    "users/user-private-profile",
    async (userId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:9080/api/v1/users/profile/`, config);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//blocking user action
export const blockUserAction = createAsyncThunk(
    "users/block-user",
    async (userId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:9080/api/v1/users/block/${userId}`,
                {},
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//unblocking  user action
export const unBlockUserAction = createAsyncThunk(
    "users/unblock-user",
    async (userId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:9080/api/v1/users/unblock/${userId}`,
                {},
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//following user action
export const followUserAction = createAsyncThunk(
    "users/follow-user",
    async (userId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:9080/api/v1/users/follow-account/${userId}`,
                {},
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//unfollowing user action
export const unFollowUserAction = createAsyncThunk(
    "users/unfollow-user",
    async (userId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:9080/api/v1/users/unfollow-account/${userId}`,
                {},
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//sending account verification email action
export const sendAccVerificationEmailAction = createAsyncThunk(
    "users/send-account-verification-email",
    async (userId, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:9080/api/v1/users/account-verification-email`,
                {},
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//account verification action
export const verifyAccountAction = createAsyncThunk(
    "users/account-verified",
    async (verifyToken, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(
                `http://localhost:9080/api/v1/users/verify-account/${verifyToken}`,
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//forgot password Action
export const forgotPasswordAction = createAsyncThunk(
    "users/forgot-password",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const { data } = await axios.post(
                `http://localhost:9080/api/v1/users/forgetPassword`,
                payload
            );
            //! save the user into localstorage
            localStorage.setItem("userInfo", JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//reset password action
export const passwordResetAction = createAsyncThunk(
    "users/password-reset",
    async ({ resetToken, password }, { rejectWithValue, getState, dispatch }) => {
        //make request
        try {
            const { data } = await axios.post(
                `http://localhost:9080/api/v1/users/resetPassword/${resetToken}`,
                {
                    password,
                }
            );
            //! save the user into localstorage
            localStorage.setItem("userInfo", JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//update profile action
export const updateUserProfileAction = createAsyncThunk(
    "users/update-user-profile",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        //make request
        console.log(payload);
        try {
            const token = getState().users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Autherization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(
                `http://localhost:9080/api/v1/users/update-profile`,
                payload,
                config
            );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);



//! Users Slices
const usersSlice = createSlice({
    name: 'users',
    initialState: INITIAL_STATE,
    extraReducers: (builder) => {

        //login
        //hndle the pending state
        builder.addCase(loginAction.pending, (state, action) => {
            state.loading = true

        });
        // handle the fulfilled state 
        builder.addCase(loginAction.fulfilled, (state, action) => {
            state.userAuth.userInfo = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });

        //Handle the rejected state
        builder.addCase(loginAction.rejected, (state, action) => {

            state.error = action.payload;
            state.loading = false;
        });

        //register
        //handle pending state
        builder.addCase(registerAction.pending, (state, action) => {
            state.loading = true

        });
        // handle the fulfilled state 
        builder.addCase(registerAction.fulfilled, (state, action) => {
            state.user = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });

        //Handle the rejected state
        builder.addCase(registerAction.rejected, (state, action) => {

            state.error = action.payload;
            state.loading = false;
        });

        //fetch public user profile
        //handle the pending state
        builder.addCase(userPublicProfileAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle the fulfilled state
        builder.addCase(userPublicProfileAction.fulfilled, (state, action) => {
            state.user = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //handle the rejected state
        builder.addCase(userPublicProfileAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //fetch private user profile
        //handle the pending state
        builder.addCase(userPrivateProfileAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle the fulfilled state
        builder.addCase(userPrivateProfileAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //handle the rejected state
        builder.addCase(userPrivateProfileAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //blocking user
        //handle pending state
        builder.addCase(blockUserAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(blockUserAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //handle rejected state
        builder.addCase(blockUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //unblocking user
        //handle pending state
        builder.addCase(unBlockUserAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(unBlockUserAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //handle rejected state
        builder.addCase(unBlockUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //following user
        //handle pending state
        builder.addCase(followUserAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(followUserAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //handle rejected state
        builder.addCase(followUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //unfollow user
        //hnadle pending state
        builder.addCase(unFollowUserAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(unFollowUserAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //handle rejected state
        builder.addCase(unFollowUserAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //send account verification email
        //hnadle pending state
        builder.addCase(sendAccVerificationEmailAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(sendAccVerificationEmailAction.fulfilled, (state, action) => {
            state.isEmailSent = true;
            state.loading = false;
            state.error = null;
        });
        //handle rejected state
        builder.addCase(sendAccVerificationEmailAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //verify account
        //handle pending state
        builder.addCase(verifyAccountAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(verifyAccountAction.fulfilled, (state, action) => {
            state.isverified = true;
            state.loading = false;
            state.error = null;
        });
        //handle rejected state
        builder.addCase(verifyAccountAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });


        //forget password
        //handle pending state
        builder.addCase(forgotPasswordAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(forgotPasswordAction.fulfilled, (state, action) => {
            state.isEmailSent = true;
            state.emailMessage = action.payload;
            state.success = true;
            state.loading = false;
            state.error = null;
        });
        //handle rejected state
        builder.addCase(forgotPasswordAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        //update profile
        //handle pending state
        builder.addCase(updateUserProfileAction.pending, (state, action) => {
            state.loading = true;
        });
        //handle fulfilled state
        builder.addCase(updateUserProfileAction.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.isUpdated = true;
            state.loading = false;
            state.error = null;
        });
        //handle rejected state
        builder.addCase(updateUserProfileAction.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.isUpdated = false;
        });

        // Reset Error Action
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
const userReducer = usersSlice.reducer;

export default userReducer;
