const { createAsyncThunk } = require("@reduxjs/toolkit");

//! Reset Success Action 

export const resetSuccessAction = createAsyncThunk(
    'reset-success-action',
    () => {
        return true;
    }
);

//! Reset error Action 

export const resetErrorAction = createAsyncThunk(
    'reset-error-action',
    () => {
        return true;
    }
);