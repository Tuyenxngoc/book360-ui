import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faBell, faClipboard, faHeart, faUser, faPen } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import images from "~/assets";
import useAuth from "~/hooks/useAuth";

import Style from './SideBar.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

function SideBar() {

    const location = useLocation();
    const { customer } = useAuth();
    const [isAccountPanelOpen, setAccountPanelOpen] = useState(true);
    const [isTransactionPanelOpen, setTransactionPanelOpen] = useState(true);

    const isLinkActive = (to) => {
        return location.pathname === to;
    };

    const toggleAccountPanel = () => {
        setAccountPanelOpen(!isAccountPanelOpen);
    };

    const toggleTransactionPanel = () => {
        setTransactionPanelOpen(!isTransactionPanelOpen);
    };

    return (
        <aside>
            <div className={cx('user-info')}>
                <div className={cx('avatar')}>
                    <Avatar alt="user" src={customer.avatar || images.userDefault} sx={{ width: 50, height: 50 }} />
                </div>
                <div className={cx('info')}>
                    <p>{customer.name}</p>
                    <Link to="/profile">
                        <FontAwesomeIcon icon={faPen} />
                        <span>Chỉnh sửa tài khoản</span>
                    </Link>
                </div>
            </div>

            <div className={cx('sideBarPanel')}>
                <div className={cx('panelTitle')} onClick={toggleAccountPanel}>
                    <strong>Quản lý tài khoản</strong>
                </div>
                {isAccountPanelOpen && (
                    <div className={cx('panelContent', { 'open': isAccountPanelOpen })}>
                        <ul className={cx('panelList')}>
                            <li className={cx('panelItem')}>
                                <Link to='/profile' className={cx('panelLink', { 'active': isLinkActive('/profile') })}>
                                    <span className={cx('icon')}><FontAwesomeIcon icon={faUser} /></span>
                                    Hồ sơ
                                </Link>
                            </li>
                            <li className={cx('panelItem')}>
                                <Link to='/password' className={cx('panelLink', { 'active': isLinkActive('/password') })}>
                                    <span className={cx('icon')}><FontAwesomeIcon icon={faKey} /></span>
                                    Đổi mật khẩu
                                </Link>
                            </li>
                            <li className={cx('panelItem')}>
                                <Link to='/notification' className={cx('panelLink', { 'active': isLinkActive('/notification') })}>
                                    <span className={cx('icon')}><FontAwesomeIcon icon={faBell} /></span>
                                    Cài đặt thông báo
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className={cx('sideBarPanel')}>
                <div className={cx('panelTitle')} onClick={toggleTransactionPanel}>
                    <strong>Quản lý giao dịch</strong>
                </div>
                {isTransactionPanelOpen && (
                    <div className={cx('panelContent', { 'open': isTransactionPanelOpen })}>
                        <ul className={cx('panelList')}>
                            <li className={cx('panelItem')}>
                                <Link to='/purchase' className={cx('panelLink', { 'active': isLinkActive('/purchase') })}>
                                    <span className={cx('icon')}><FontAwesomeIcon icon={faClipboard} /></span>
                                    Đơn hàng
                                </Link>
                            </li>
                            <li className={cx('panelItem')}>
                                <Link to='/favorite' className={cx('panelLink', { 'active': isLinkActive('/favorite') })}>
                                    <span className={cx('icon')}><FontAwesomeIcon icon={faHeart} /></span>
                                    Sản phẩm yêu thích
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default SideBar;