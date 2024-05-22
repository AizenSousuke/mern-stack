const USER_LOGGED_IN = 'USER_LOGGED_IN';
const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

const userLogin = () => {
    return {
        type: USER_LOGGED_IN,
        payload: {}
    }
}

const userLogout = () => {
    return {
        type: USER_LOGGED_OUT,
        payload: {}
    }
}