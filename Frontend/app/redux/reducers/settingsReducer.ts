const initialState = {
    goingOut: [],
    goingHome: [],
    theme: {
        darkMode: false,
    },
    dateUpdated: null
}

export const settingsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        default:
            return state;
    }
}