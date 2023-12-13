import PropTypes from 'prop-types';
import AdminNavBar from '~/components/AdminNavBar';

import AdminSideBar from '~/components/AdminSideBar/AdminSideBar';

function AdminLayout({ children }) {
    return (
        <>
            <div className='container-fluid g-0' style={{ backgroundColor: 'white' }}>
                <div className="row g-0 ">
                    <div className='col-2'>
                        <AdminSideBar />
                    </div>
                    <div className="col-10">
                        <AdminNavBar />
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}

AdminLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminLayout;