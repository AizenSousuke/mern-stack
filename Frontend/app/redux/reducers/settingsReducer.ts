const initialState = {
    GoingOut: [],
    GoingHome: [],
    Theme: {
        DarkMode: false,
    },
    DateUpdated: null
}

export const settingsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        default:
            return state;
    }
}