import { combineReducers } from "@reduxjs/toolkit";
import { settingsReducer } from "./settingsReducer";
import { busStopReducer } from "./busStopReducer";
import { userReducer } from "./userReducer";
import { homePageSlice } from "../features/homePage/homePageSlice";

// Optional root Reducer
export const rootReducer = combineReducers({
    home: homePageSlice.reducer,
    // user: userReducer,
    // settings: settingsReducer,
    // busStop: busStopReducer
});