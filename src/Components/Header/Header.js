import images from '~/assets/images';
import Button from '~/components/Button';
//Config
import config from '~/config';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
//React
import { Link } from 'react-router-dom';
import { useState } from 'react';
//Styles
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import useAuth from '~/hooks/useAuth';

const cx = classNames.bind(styles);

function Header() {

    const { isAuthenticated, user, logout } = useAuth();
    const [keyword, setKeyword] = useState('');

    return (
        <header className={cx('wrapper')}>
            <div className="container">
                <div className={cx('inner')}>
                    <div className={cx('logo')}>
                        <Link to={config.routes.home}> <img src={images.logo} alt='logo'></img></Link>
                    </div>

                    <div className={cx('search')}>
                        <input
                            id="searchInput"
                            name="searchKeyword"
                            value={keyword}
                            onChange={(event) => { setKeyword(event.target.value) }}
                            placeholder='Tìm kiếm...'
                            spellCheck={false}>
                        </input>
                        <Link
                            to={config.routes.searchResults + `?keyword=${keyword}`}
                            className={cx('search-btn')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Link>
                    </div>

                    <div className={cx('actions')}>
                        <Link className={cx('cart')} to={'/cart'}><img src={images.cart} alt='cart'></img></Link>
                        {isAuthenticated ?
                            (
                                <div className={cx('user-navbar')}>
                                    <Button rounded leftIcon={<img src={images.userDefault} alt='user default'></img>}>{user.username || 'user'}</Button>
                                    <ul className={cx("user-menu")}>
                                        <li className={cx("user-menu-item")}>
                                            <Link to="/profile">Tài khoản của tôi</Link>
                                        </li>
                                        <li className={cx("user-menu-item")}>
                                            <Link to="/purchase">Đơn mua</Link>
                                        </li>
                                        <li className={cx("user-menu-item", "separate")}>
                                            <Link onClick={logout}>Đăng xuất</Link>
                                        </li>
                                    </ul>
                                </div>
                            )
                            :
                            (
                                <Button to={'/login'}>Đăng nhập</Button>
                            )
                        }
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;