import { combineReducers } from "@reduxjs/toolkit";
import { useReducer } from "react";
import { settingsReducer } from "./settingsReducer";
import { busStopReducer } from "./busStopReducer";

// Optional root Reducer
export const rootReducer = combineReducers({
    useReducer,
    settingsReducer,
    busStopReducer
});