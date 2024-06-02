/**
 * Use the actions below in dispatch
 */
import { UserData } from "../../classes/UserData"
import { USER_LOGGED_IN, USER_LOGGED_OUT } from "./userActionTypes"

const userLogin = (userData: UserData) => {
    return {
        type: USER_LOGGED_IN,
        payload: userData.toPlainObject()
    }
}

const userLogout = () => {
    return {
        type: USER_LOGGED_OUT,
        payload: null
    }
}

export { userLogin, userLogout }