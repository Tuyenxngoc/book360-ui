import images from '~/assets/images';
import Button from '~/components/Button';
//Config
import config from '~/config';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSignIn } from '@fortawesome/free-solid-svg-icons'
//React
import { Link } from 'react-router-dom';
import { useState } from 'react';
//Styles
import classNames from 'classnames/bind';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header() {
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
                        <Button text leftIcon={<img src={images.cart} alt='cart'></img>}></Button>
                        <Button to={'/login'} leftIcon={<FontAwesomeIcon icon={faSignIn}></FontAwesomeIcon>}>Đăng nhập</Button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;