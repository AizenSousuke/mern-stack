import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../../api/api"

interface IHomeSettings {
    isLoggedIn: boolean;
    isLoading: boolean;
    token: string | null;
}

const initialState: IHomeSettings = {
    isLoggedIn: false,
    isLoading: false,
    token: null
}

export const signIn = createAsyncThunk('Home/signIn', async () => {
    return await api.SignIn();
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
        }
    },
    extraReducers: (builder) => {
    }
})

export const { loggedIn, setToken } = HomePageSlice.actions;