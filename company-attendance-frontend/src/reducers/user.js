function userReducer(state="", action){
    switch (action.type) {
        case 'LOAD_USER':
            return action.payload

        case 'REMOVE_USER':
            return ""
            
        default:
            return state
    }
}

export default userReducer;