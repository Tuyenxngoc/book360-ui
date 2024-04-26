import PropTypes from 'prop-types';

import Header from '~/components/User/Header';

function HeaderOnly({ children }) {
    return (
        <>
            <Header></Header>
            {children}
        </>
    );

}

HeaderOnly.propTypes = {
    children: PropTypes.node.isRequired,
};

export default HeaderOnly;