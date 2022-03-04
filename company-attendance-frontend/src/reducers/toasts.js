let id = 0
function toastsReducer(state=[], action) {
    switch (action.type) {
        case 'ADD_TOAST':
            return [...state, {...action.payload, show: true, id: ++id}];
        
        case 'REMOVE_TOAST':
            return state.filter(toast => toast.id !== action.payload);

        case 'HIDE_TOAST':
            return state.map(toast => {
                if (toast.id === action.payload) {
                    toast.show = false;
                }
                return toast;
            })
            
        default:
            return state
    }
}

export default toastsReducer