import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isLoggedIn: false
}

const homePageSlice = createSlice({
    name: 'Home',
    initialState: initialState,
    reducers: {
        loggedIn: (state, action) => {
            state.isLoggedIn == action.payload;
        }
    }
})

module.exports = homePageSlice.reducer;
module.exports.homeActions = homePageSlice.actions;