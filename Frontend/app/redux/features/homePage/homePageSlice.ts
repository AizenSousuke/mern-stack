import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../api/api"
import { ToastAndroid } from "react-native";

interface IHomeSettings {
    isLoggedIn: boolean;
    isLoading: boolean;
    token: string | null;
}

const initialState: IHomeSettings = {
    isLoggedIn: false,
    isLoading: false,
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

export const HomePageSlice = createSlice({
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
            state.token = action.payload.token;
        });
        builder.addCase(getSettings.pending, (state, action) => {
            state.isLoading = true;
        });
        builder.addCase(getSettings.fulfilled, (state, action) => {
            state.isLoading = false;
            state.goingOut = action.payload.settings?.Settings?.GoingOut;
            state.goingHome = action.payload.settings?.Settings?.GoingHome;
            ToastAndroid.show("Successfully get settings", ToastAndroid.SHORT);
        });
        builder.addCase(getSettings.rejected, (state, action) => {
            state.isLoading = false;
            ToastAndroid.show(
                "Failed to get settings",
                ToastAndroid.SHORT
            );
        });
    }
})

export const { loggedIn, setToken, goingOut, goingHome } = HomePageSlice.actions;