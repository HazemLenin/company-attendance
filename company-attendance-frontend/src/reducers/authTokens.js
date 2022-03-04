const initialState = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

function authTokensReducer(state=initialState , action) {
    switch (action.type) {
        case "SET_TOKENS":
            localStorage.setItem('authTokens', JSON.stringify(action.payload));
            return action.payload;

        case "REMOVE_TOKENS":
            localStorage.removeItem('authTokens');
            return null;

        default:
            return state;
    }
}

export default authTokensReducer;