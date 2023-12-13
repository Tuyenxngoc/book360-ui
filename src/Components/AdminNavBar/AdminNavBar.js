import { Avatar } from "antd";
import { Link } from "react-router-dom";
import images from "~/assets";
import useAuth from "~/hooks/useAuth";

import classNames from 'classnames/bind';
import styles from './AdminNavBar.module.scss';

const cx = classNames.bind(styles);

function AdminNavBar() {
    const { customer } = useAuth();
    return (
        <div className={cx('admin-navbar')}>
            <Link className={cx('link')} to='/'>Trang chủ</Link>
            <Link className={cx('link')} to='/'>Đăng xuất</Link>
            <Avatar className={cx('avatar')} alt={customer.name} src={customer.avatar || images.userDefault} />
        </div>
    )
}

export default AdminNavBar;