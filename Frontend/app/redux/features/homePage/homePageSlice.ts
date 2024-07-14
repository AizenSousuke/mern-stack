import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../api/api"

const initialState = {
    isLoggedIn: false
}

export const signIn = createAsyncThunk('Home/signIn', async () => {
    return await api.SignIn();
})

export const homePageSlice = createSlice({
    name: 'Home',
    initialState: initialState,
    reducers: {
        loggedIn: (state, action) => {
            state.isLoggedIn == action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signIn.fulfilled, (state, action) => {
        })
    }
})

export const { loggedIn } = homePageSlice.actions;