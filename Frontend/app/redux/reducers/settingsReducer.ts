import { SETTINGS_LOADED, SETTINGS_SAVED } from "../actions/settingsActionTypes";

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
        case SETTINGS_SAVED:
            return {
                ...state,
                ...action.payload,
                dateUpdated: Date.now()
            }
        case SETTINGS_LOADED:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}