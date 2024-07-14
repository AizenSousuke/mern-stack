import { combineReducers } from "@reduxjs/toolkit";
import { settingsReducer } from "./settingsReducer";
import { busStopReducer } from "./busStopReducer";
import { userReducer } from "./userReducer";
import * as homePageSlice from "../features/homePage/homePageSlice";

// Optional root Reducer
export const rootReducer = combineReducers({
    home: homePageSlice,
    user: userReducer,
    settings: settingsReducer,
    busStop: busStopReducer
});