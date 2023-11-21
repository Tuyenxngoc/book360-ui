import images from '~/assets/images';
import Button from '~/components/Button';
//Config
import config from '~/config';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
//React
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
//Styles
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import useAuth from '~/hooks/useAuth';

const cx = classNames.bind(styles);

function Header() {
    let { currentUser, logout } = useAuth();
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        logout();
        navigate("/");
    }

    return (
        <header className={cx('wrapper')}>
            <div className="container">
                <div className={cx('inner')}>
                    <div className={cx('logo')}>
                        <Link to={config.routes.home}> <img src={images.logo} alt='logo'></img></Link>
                    </div>

                    <div className={cx('search')}>
                        <input
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
                        {currentUser.accessToken ?
                            (
                                <button onClick={handleLogout}>Đăng Xuất</button>

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