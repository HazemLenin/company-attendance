import isAuthenticatedReducer from "./isAuthenticated";
import authTokensReducer from "./authTokens";
import userReducer from "./user";
import toastsReducer from "./toasts";

import { combineReducers } from "redux";

const allReducers = combineReducers({
    isAuthenticated: isAuthenticatedReducer,
    authTokens: authTokensReducer,
    user: userReducer,
    toasts: toastsReducer
});

export default allReducers;