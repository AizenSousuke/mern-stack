/**
 * Use the actions below in dispatch
 */
import { USER_LOGGED_IN, USER_LOGGED_OUT } from "./userActionTypes"

const userLogin = (userData: object) => {
    return {
        type: USER_LOGGED_IN,
        payload: userData
    }
}

const userLogout = () => {
    return {
        type: USER_LOGGED_OUT,
        payload: null
    }
}

export { userLogin, userLogout }