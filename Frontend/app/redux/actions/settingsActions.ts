import { SETTINGS_LOADED, SETTINGS_SAVED } from "./settingsActionTypes"

const settingsSaved = (settings: object) => {
    return {
        type: SETTINGS_SAVED,
        payload: settings
    }
}

const settingsLoaded = (settings: object) => {
    return {
        type: SETTINGS_LOADED,
        payload: settings
    }
}


export { settingsSaved }