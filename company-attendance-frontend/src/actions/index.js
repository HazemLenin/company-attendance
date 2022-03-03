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


// profile reducer

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


// toasts reducer

export function add_toast(data) {
    return {
        type: 'ADD_TOAST',
        payload: data
    }
}

export function hide_toast(data) {
    return {
        type: 'HIDE_TOAST',
        payload: data
    }
}

export function remove_toast(data) {
    return {
        type: 'REMOVE_TOAST',
        payload: data
    }
}