import { configureStore } from '@reduxjs/toolkit';
import { HomePageSlice, signIn, getSettings } from './homePageSlice';
import api from '../../../api/api';

jest.mock('../../../api/api', () => ({
    SignIn: jest.fn(),
    GetSettings: jest.fn()
}));

describe('HomePageSlice', () => {
    let store: any;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                Home: HomePageSlice.reducer
            }
        });
    });

    test('should handle initial state', () => {
        const state = store.getState().Home;
        expect(state).toEqual({
            isLoggedIn: false,
            isLoading: false,
            token: null,
            goingOut: [],
            goingHome: []
        });
    });

    test('should handle loggedIn', () => {
        store.dispatch(HomePageSlice.actions.loggedIn(true));
        const state = store.getState().Home;
        expect(state.isLoggedIn).toBe(true);
    });

    test('should handle setToken', () => {
        const token = 'test-token';
        store.dispatch(HomePageSlice.actions.setToken(token));
        const state = store.getState().Home;
        expect(state.token).toBe(token);
    });

    test('should handle goingOut', () => {
        const goingOut = ['task1', 'task2'];
        store.dispatch(HomePageSlice.actions.goingOut(goingOut));
        const state = store.getState().Home;
        expect(state.goingOut).toEqual(goingOut);
    });

    test('should handle goingHome', () => {
        const goingHome = ['task3', 'task4'];
        store.dispatch(HomePageSlice.actions.goingHome(goingHome));
        const state = store.getState().Home;
        expect(state.goingHome).toEqual(goingHome);
    });

    test('should handle signIn thunk', async () => {
        api.SignIn.mockResolvedValueOnce({ token: 'mockToken' });
        await store.dispatch(signIn());
        expect(api.SignIn).toHaveBeenCalledTimes(1);
        const state = store.getState();
        expect(state.Home.token).toBe('mockToken');
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
        const state = store.getState().Home;

        expect(api.GetSettings).toHaveBeenCalledWith(token);
        expect(state.goingOut).toEqual(mockSettings.settings.Settings.GoingOut);
        expect(state.goingHome).toEqual(mockSettings.settings.Settings.GoingHome);
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
