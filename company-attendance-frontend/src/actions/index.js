// authTokens reducer

export function set_tokens(data) {
    return {
        type: 'SET_TOKENS',
        payload: data
    }
}

export function remove_tokens() {
    return {
        type: 'REMOVE_TOKENS',
    }
}

// isAuthenticated reducer

export function login_user(data) {
    return {
        type: 'LOGIN',
        payload: data
    }
}

export function logout_user() {
    return {
        type: 'LOGOUT',
    }
}


// user reducer

export function load_user(data) {
    return {
        type: 'LOAD_USER',
        payload: data
    }
}

export function remove_user() {
    return {
        type: 'REMOVE_USER'
    }
}


// prfile reducer

export function load_profile(data) {
    return {
        type: 'LOAD_PROFILE',
        payload: data
    }
}

export function remove_profile() {
    return {
        type: 'REMOVE_profile'
    }
}