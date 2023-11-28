import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "~/hooks/useAuth";

function RequireAuth() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (isAuthenticated) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
}

export default RequireAuth;