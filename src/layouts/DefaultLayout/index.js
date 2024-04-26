import PropTypes from 'prop-types';

import Header from '~/components/User/Header';
import Footer from '~/components/User/Footer';
import ChatIcon from '~/components/User/Chat/ChatIcon';

function DefaultLayout({ children }) {
    return (
        <>
            <ChatIcon />
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
