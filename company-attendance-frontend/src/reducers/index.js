import isAuthenticatedReducer from "./isAuthenticated";
import authTokensReducer from "./authTokens";
import userReducer from "./user";
// import profileReducer from "./profile";

import { combineReducers } from "redux";

const allReducers = combineReducers({
    isAuthenticated: isAuthenticatedReducer,
    authTokens: authTokensReducer,
    user: userReducer,
    // profile: profileReducer
});

export default allReducers;