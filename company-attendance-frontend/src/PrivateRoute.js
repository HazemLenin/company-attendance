import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Login } from './components';

function PrivateRoute({ roles, children }) {

    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const user = useSelector(state => state.user);

    function containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
    
        return false;
    }

    if (isAuthenticated) {
        if (roles & containsObject(user.role, roles)) {
            return <Navigate to="/login" />
        }
    }

    return (
        isAuthenticated ? children : <Navigate to="/login" />

    )

}

export default PrivateRoute;