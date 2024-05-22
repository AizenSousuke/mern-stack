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
        default:
            return state;
    }
}