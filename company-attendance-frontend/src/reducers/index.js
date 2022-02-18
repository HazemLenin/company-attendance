import isAuthenticatedReducer from "./isAuthenticated";
import userReducer from "./user";
import profileReducer from "./profile";

import { combineReducers } from "redux";

const allReducers = combineReducers({
    isAuthenticated: isAuthenticatedReducer,
    user: userReducer,
    profile: profileReducer
});

export default allReducers;