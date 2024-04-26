import { Avatar, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import images from '~/assets';
import useAuth from '~/hooks/useAuth';

import classNames from 'classnames/bind';
import styles from './AdminNavBar.module.scss';

const cx = classNames.bind(styles);

function AdminNavBar() {
    const { customer, logout } = useAuth();
    return (
        <div className={cx('admin-navbar')}>
            <Link className={cx('link')} to="/">
                Trang chủ
            </Link>
            <Link className={cx('link')} to="/" onClick={() => logout()}>
                Đăng xuất
            </Link>
            <Tooltip title={customer.fullName}>
                <Avatar className={cx('avatar')} alt={customer.fullName} src={customer.avatar || images.userDefault} />
            </Tooltip>
        </div>
    );
}

export default AdminNavBar;
