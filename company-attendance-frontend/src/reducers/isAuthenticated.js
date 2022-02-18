let initialState = localStorage.getItem('AuthToken') ? true : false;

function isAuthenticatedReducer(state = initialState, action) {
    switch (action.type) {

        case 'LOGIN':

            localStorage.setItem('AuthToken', JSON.stringify(action.payload));

            return true;

        case 'LOGOUT':

            localStorage.removeItem('AuthToken');

            return false;

        default:
            return state
    }
}

export default isAuthenticatedReducer;