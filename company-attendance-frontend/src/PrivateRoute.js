import React, { useState } from 'react';
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ roles, children }) {

    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const user = useSelector(state => state.user);
    const [ GlobalRoles, setGlobalRoles ] = useState([
        "managers", "receptionists", "employees",
    ])

    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
    
        return false;
    }

    if (isAuthenticated && roles) {
        if (!containsObject(GlobalRoles[user.role - 1], roles)) {
            return <Navigate to="/login" />
        }
    }

    return (
        isAuthenticated ? children : <Navigate to="/login" />

    )

}

export default PrivateRoute;