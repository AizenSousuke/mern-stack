import { USER_LOGGED_IN, USER_LOGGED_OUT } from "../actions/userActionTypes";

const initialState = {
    userId: null,
    userName: null,
    userEmail: null,
    userAvatar: null,
    userIsAdmin: false,
    socialId: null,
    userIsLoggedIn: false,
    token: null,
    refreshToken: null,
    tokenExpiryDate: null
}

export const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case USER_LOGGED_IN:
            return {
                ...state,
                ...action.payload,
                userIsLoggedIn: true
            }
        case USER_LOGGED_OUT:
            return initialState;
        default:
            return state;
    }
}