import PropTypes from 'prop-types';

import Footer from '~/components/User/Footer';
import Header from '~/components/User/Header';
import SideBar from '~/components/Common/SideBar';

function UserDashboard({ children }) {
    return (
        <>
            <Header></Header>
            <main className='container my-3'>
                <div className='row'>
                    <div className='col-2'>
                        <SideBar />
                    </div>
                    <div className='col-10'>
                        {children}
                    </div>
                </div>
            </main>
            <Footer></Footer>
        </>
    );
}

UserDashboard.propTypes = {
    children: PropTypes.node.isRequired,
};

export default UserDashboard;