let initialState = localStorage.getItem('authTokens') ? true : false;

function isAuthenticatedReducer(state = initialState, action) {
    /* Normal reducer that checks if there is a token or not */
    switch (action.type) {

        case 'LOGIN':

            return true;

        case 'LOGOUT':

            return false;

        default:
            return state
    }
}

export default isAuthenticatedReducer;