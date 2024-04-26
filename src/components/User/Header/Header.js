import images from '~/assets';
import Button from '~/components/Common/Button';
//Config
import config from '~/config';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
//React
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
//Styles
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import useAuth from '~/hooks/useAuth';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Avatar, Badge } from '@mui/material';
import useCart from '~/hooks/useCart';

const cx = classNames.bind(styles);

function Header() {
    const [keyword, setKeyword] = useState('');
    const { isAuthenticated, customer, logout } = useAuth();
    const { totalProducts, setTotalProducts, updateTotalProducts } = useCart();

    const handleLogout = () => {
        setTotalProducts(0);
        logout();
    };

    useEffect(() => {
        updateTotalProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <header className={cx('wrapper')}>
            <div className="container">
                <nav className={cx('header-navbar')}>
                    <ul className={cx('navbar-list')}>
                        <li className={cx('navbar-item')}>
                            <a className={cx('navbar-item-link')} href="/" target="_blank" rel="noopener noreferrer">
                                Chăm sóc khách hàng
                            </a>
                        </li>
                        <li className={cx('navbar-item')}>
                            <div className={cx('navbar-tilte')}>Kết nối</div>
                            <a
                                href="https://www.facebook.com"
                                target="_blank"
                                className={cx('navbar-icon-link')}
                                rel="noopener noreferrer"
                                title="Kết nối Faceboock"
                            >
                                <FontAwesomeIcon icon={faFacebook} />
                            </a>
                            <a
                                href="https://www.facebook.com"
                                target="_blank"
                                className={cx('navbar-icon-link')}
                                rel="noopener noreferrer"
                                title="Kết nối Instagram!"
                            >
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                        </li>
                    </ul>
                </nav>

                <div className={cx('header-with-search')}>
                    <div className={cx('logo')}>
                        <Link to={config.routes.home}>
                            {' '}
                            <img src={images.logo} alt="logo" />
                        </Link>
                    </div>

                    <div className={cx('search')}>
                        <input
                            id="searchInput"
                            name="searchKeyword"
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                            placeholder="Tìm kiếm..."
                            spellCheck={false}
                        />
                        <Link to={config.routes.searchResults + `?keyword=${keyword}`} className={cx('search-btn')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Link>
                    </div>

                    <div className={cx('actions')}>
                        <Link className={cx('cart')} to="/cart">
                            <Badge badgeContent={totalProducts} color="warning">
                                <img src={images.cart} alt="cart" />
                            </Badge>
                        </Link>

                        {isAuthenticated ? (
                            <div className={cx('user-navbar')}>
                                <Button
                                    rounded
                                    leftIcon={
                                        <Avatar
                                            alt="avt"
                                            src={customer.avatar || images.userDefault}
                                            sx={{ width: 24, height: 24 }}
                                        />
                                    }
                                >
                                    {customer.fullName || customer.username || 'user'}
                                </Button>

                                <ul className={cx('user-menu')}>
                                    <li className={cx('user-menu-item')}>
                                        <Link to="/profile">Tài khoản của tôi</Link>
                                    </li>
                                    <li className={cx('user-menu-item')}>
                                        <Link to="/purchase">Đơn mua</Link>
                                    </li>
                                    <li className={cx('user-menu-item', 'separate')}>
                                        <Link onClick={handleLogout}>Đăng xuất</Link>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Button to={'/login'}>Đăng nhập</Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
