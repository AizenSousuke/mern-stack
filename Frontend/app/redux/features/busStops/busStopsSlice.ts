import { createSlice } from "@reduxjs/toolkit";

enum Direction {
    GoingOut,
    GoingHome
}

interface IBusStopSlice {
    GoingOut: { [key: number]: ISavedBusStopBuses };
    GoingHome: { [key: number]: ISavedBusStopBuses };
}

interface ISavedBusStopBuses {
    Buses: { [key: number]: number };
}

const initialState: IBusStopSlice = {
    GoingOut: {},
    GoingHome: {}
}

/**
 * This slice takes care of saving which buses are shown (saved) for each bus stops
 */
export const BusStopsSlice = createSlice({
    name: 'BusStops',
    initialState: initialState,
    reducers: {
        addBusStopBus: (state, action) => {
            const { direction, busStopCode, busNumber }: { direction: Direction, busStopCode: number, busNumber: number } = action.payload;

            const currentDirection = direction == Direction.GoingOut ? "GoingOut" : "GoingHome";

            let busStop = state[currentDirection][busStopCode];
            busStop.Buses[busNumber] = busNumber;
        },
        removeBusStopBus: (state, action) => {
            const { direction, busStopCode, busNumber }: { direction: Direction, busStopCode: number, busNumber: number } = action.payload;

            const currentDirection = direction == Direction.GoingOut ? "GoingOut" : "GoingHome";

            let busStop = state[currentDirection][busStopCode];
            delete busStop.Buses[busNumber];
        }
    }
})

export const { addBusStopBus, removeBusStopBus } = BusStopsSlice.actions;