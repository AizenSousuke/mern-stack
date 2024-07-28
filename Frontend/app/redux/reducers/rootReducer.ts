import { combineReducers } from "@reduxjs/toolkit";
import { HomePageSlice } from "../features/homePage/homePageSlice";
import { BusStopsSlice } from "../features/busStops/busStopsSlice";

// Optional root Reducer
export const rootReducer = combineReducers({
    home: HomePageSlice.reducer,
    busStop: BusStopsSlice.reducer,
    // user: userReducer,
    // settings: settingsReducer,
});