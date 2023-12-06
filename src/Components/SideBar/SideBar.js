import { Avatar } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faLocationDot, faBell, faClipboard, faHeart, faUser } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


import images from "~/assets";
import useAuth from "~/hooks/useAuth";

import Style from './SideBar.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

function SideBar() {

    const { user } = useAuth();
    const [isAccountPanelOpen, setAccountPanelOpen] = useState(true);
    const [isTransactionPanelOpen, setTransactionPanelOpen] = useState(true);
    const location = useLocation();

    // Function to determine if a Link is active based on its "to" prop
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
                    <Avatar alt="user" src={images.userDefault} sx={{ width: 50, height: 50 }} />
                </div>
                <div className={cx('info')}>
                    <p>{user.username}</p>
                    <Link to="/profile">Chỉnh sửa tài khoản</Link>
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
                                <Link className={cx('panelLink')}>
                                    <span className={cx('icon')}><FontAwesomeIcon icon={faLocationDot} /></span>
                                    Địa chỉ
                                </Link>
                            </li>
                            <li className={cx('panelItem')}>
                                <Link className={cx('panelLink')}>
                                    <span className={cx('icon')}><FontAwesomeIcon icon={faKey} /></span>
                                    Đổi mật khẩu
                                </Link>
                            </li>
                            <li className={cx('panelItem')}>
                                <Link className={cx('panelLink')}>
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
                                <Link className={cx('panelLink')}>
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