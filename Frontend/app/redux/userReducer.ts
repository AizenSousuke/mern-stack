const initialState = {
    userName: null,
    userIsLoggedIn: false,
    token: null,
    refreshToken: null,
    tokenExpiryDate: null
}

export const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
        default:
            return state;
    }
}