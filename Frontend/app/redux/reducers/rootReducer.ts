import { combineReducers } from "@reduxjs/toolkit";
import { settingsReducer } from "./settingsReducer";
import { busStopReducer } from "./busStopReducer";
import { userReducer } from "./userReducer";

// Optional root Reducer
export const rootReducer = combineReducers({
    user: userReducer,
    settings: settingsReducer,
    busStop: busStopReducer
});