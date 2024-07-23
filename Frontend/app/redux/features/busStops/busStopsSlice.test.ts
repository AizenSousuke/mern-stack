import { BusStopsSlice, addBusStopBus, removeBusStopBus } from './busStopsSlice';
import { configureStore } from '@reduxjs/toolkit';

const initialState = {
    GoingOut: {},
    GoingHome: {}
};

describe('BusStopsSlice', () => {
    let store: any;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                BusStops: BusStopsSlice.reducer
            },
            preloadedState: {
                BusStops: initialState
            }
        });
    });

    test('should handle addBusStopBus action', () => {
        const action = addBusStopBus({
            direction: 0, // Direction.GoingOut
            busStopCode: 123,
            busNumber: 456
        });

        store.dispatch(action);
        const state = store.getState().BusStops;

        expect(state.GoingOut[123].Buses[456]).toBe(456);
    });

    test('should handle removeBusStopBus action', () => {
        const addAction = addBusStopBus({
            direction: 0, // Direction.GoingOut
            busStopCode: 123,
            busNumber: 456
        });

        store.dispatch(addAction);

        const removeAction = removeBusStopBus({
            direction: 0, // Direction.GoingOut
            busStopCode: 123,
            busNumber: 456
        });

        store.dispatch(removeAction);
        const state = store.getState().BusStops;

        expect(state.GoingOut[123].Buses[456]).toBeUndefined();
    });

    test('should delete undefined without errors', () => {
        const removeAction = removeBusStopBus({
            direction: 0,
            busStopCode: 111,
            busNumber: 911
        })

        store.dispatch(removeAction);
        const state = store.getState().BusStops;

        expect(state.GoingOut[111]?.Buses[911]).toBeUndefined();
    })
});
