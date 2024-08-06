import { configureStore } from '@reduxjs/toolkit';
import { HomePageSlice, signIn } from './homePageSlice';
import api from '../../../api/api';

jest.mock('../../../api/api', () => ({
    SignIn: jest.fn()
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
        // console.log("State: ", state);
        expect(state).toEqual({
            isLoggedIn: false,
            isLoading: false,
            token: null
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

    // Note: Not working
    // test('should handle signIn thunk', async () => {
    //     api.SignIn.mockResolvedValueOnce({ token: 'mockToken' });
    //     await store.dispatch(signIn());
    //     expect(api.SignIn).toHaveBeenCalledTimes(1);
    //     const state = store.getState();
    //     console.log("State: ", state);
    //     expect(state.Home.token).toBe('mockToken');
    // });
});
