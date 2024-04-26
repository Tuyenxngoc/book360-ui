import { Link, Outlet, useLocation } from 'react-router-dom';

function UserDashboard() {
    const location = useLocation();

    console.log(location.pathname);

    return (
        <div className="container my-3">
            <div className="row">
                <div className="col-2">
                    <Link to="account">aaa</Link>
                    <Link to="notifications">aada</Link>
                </div>
                <div className="col-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;
