import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "~/hooks/useAuth";
import PropTypes from 'prop-types';

function RequireAuth({ allowedRoles }) {
    const { currentUser } = useAuth();
    const location = useLocation();

    if (allowedRoles.includes(currentUser.role)) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
}

RequireAuth.propTypes = {
    allowedRoles: PropTypes.array.isRequired,
}

export default RequireAuth;