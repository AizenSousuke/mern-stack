import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../api/api"

const initialState = {
    isLoggedIn: false,
    token: null,
    goingOut: [],
    goingHome: []
}

export const signIn = createAsyncThunk('Home/signIn', async () => {
    return await api.SignIn();
})

export const getSettings = createAsyncThunk('Home/getSettings', async (token: string) => {
    return await api.GetSettings(token);
})

export const homePageSlice = createSlice({
    name: 'Home',
    initialState: initialState,
    reducers: {
        loggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        goingOut: (state, action) => {
            state.goingOut = action.payload;
        },
        goingHome: (state, action) => {
            state.goingHome = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signIn.fulfilled, (state, action) => {
        });
        builder.addCase(getSettings.fulfilled, (state, action) => {
            state.goingOut = action.payload.settings?.Settings?.GoingOut;
            state.goingHome = action.payload.settings?.Settings?.GoingHome;
        });
    }
})

export const { loggedIn, goingOut, goingHome } = homePageSlice.actions;