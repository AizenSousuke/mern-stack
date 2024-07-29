import { BusStopsSlice, addBusStopBus, removeBusStopBus, getSettings } from './busStopsSlice';
import { configureStore } from '@reduxjs/toolkit';
import api from '../../../api/api';
import Home from '../../../components/Home';
import { HomePageSlice } from '../homePage/homePageSlice';

jest.mock('../../../api/api', () => ({
    GetSettings: jest.fn()
}));

const initialState = {
    isLoading: false,
    GoingOut: {},
    GoingHome: {}
};

describe('BusStopsSlice', () => {
    let store: any;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                BusStops: BusStopsSlice.reducer,
                Home: HomePageSlice.reducer
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

    test('should handle addBusStopBus action without busNumber provided', () => {
        const action = addBusStopBus({
            direction: 0, // Direction.GoingOut
            busStopCode: 123
        });

        store.dispatch(action);
        const state = store.getState().BusStops;

        expect(state.GoingOut[123]).toStrictEqual({ Buses: {} });
        expect(state.GoingOut[123].Buses[456]).toBe(undefined);
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

    test('should handle goingOut', () => {
        const goingOut = ['task1', 'task2'];
        store.dispatch(BusStopsSlice.actions.goingOut(goingOut));
        const state = store.getState().BusStops;
        expect(state.GoingOut).toEqual(goingOut);
    });

    test('should handle goingHome', () => {
        const goingHome = ['task3', 'task4'];
        store.dispatch(BusStopsSlice.actions.goingHome(goingHome));
        const state = store.getState().BusStops;
        expect(state.GoingHome).toEqual(goingHome);
    });

    test('should handle getSettings pending and fulfilled', async () => {
        const mockSettings = {
            settings: {
                Settings: {
                    GoingOut: ['out1', 'out2'],
                    GoingHome: ['home1', 'home2']
                }
            }
        };
        api.GetSettings.mockResolvedValueOnce(mockSettings);

        const token = 'test-token';
        await store.dispatch(getSettings(token));
        const state = store.getState().BusStops;

        expect(api.GetSettings).toHaveBeenCalledWith(token);
        expect(state.GoingOut).toEqual(mockSettings.settings.Settings.GoingOut);
        expect(state.GoingHome).toEqual(mockSettings.settings.Settings.GoingHome);
    });

    test('should handle getSettings rejected', async () => {
        api.GetSettings.mockRejectedValueOnce(new Error('Failed to fetch settings'));

        const token = 'test-token';
        await store.dispatch(getSettings(token));
        const state = store.getState().Home;

        expect(api.GetSettings).toHaveBeenCalledWith(token);
        // Check if state changes as expected
        expect(state.isLoading).toBe(false);
    });
});
