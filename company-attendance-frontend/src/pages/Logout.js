import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout_user, remove_user, remove_tokens, add_toast } from '../actions';

function Logout() {
    const dispatch = useDispatch();
    useEffect(() => {
        // directly logout user because component is in private route
        dispatch(remove_user());
        dispatch(remove_tokens());
        dispatch(logout_user());
        dispatch(add_toast({
            page: "Logout",
            content: `You logged out successfully.`,
            bg: "success",
            text: "text-white"
        }));
    })
    return <Navigate to="/" />
}

export default Logout;