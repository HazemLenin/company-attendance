import React from 'react';
import { Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout_user, remove_user, remove_profile } from '../actions';

function Logout() {
    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const dispatch = useDispatch();

    // directly logout user because component is in private route
    dispatch(logout_user());
    dispatch(remove_user());
    dispatch(remove_profile());
    return <Navigate to="/" />
}

export default Logout;