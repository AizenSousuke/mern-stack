import { combineReducers } from "@reduxjs/toolkit";
import { settingsReducer } from "./settingsReducer";
import { busStopReducer } from "./busStopReducer";
import { userReducer } from "./userReducer";
import { HomePageSlice } from "../features/homePage/homePageSlice";
import { BusStopsSlice } from "../features/busStops/busStopsSlice";

// Optional root Reducer
export const rootReducer = combineReducers({
    home: HomePageSlice.reducer,
    busStop: BusStopsSlice.reducer,
    // user: userReducer,
    // settings: settingsReducer,
});