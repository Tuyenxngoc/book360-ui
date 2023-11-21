import { Outlet } from 'react-router-dom';
import Header from '~/components/Header';

function HeaderOnly() {
    return (
        <>
            <Header></Header>
            <Outlet />
        </>
    );
}

export default HeaderOnly
    ;