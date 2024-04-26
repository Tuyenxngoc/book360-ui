import PropTypes from 'prop-types';

import Header from '~/components/User/Header';
import Footer from '~/components/User/Footer';

function DefaultLayout({ children }) {
    return (
        <>
            <Header></Header>
            {children}
            <Footer></Footer>
        </>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;