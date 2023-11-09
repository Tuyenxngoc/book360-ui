import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import images from '~/assets/images';
import Button from '~/components/Button';

import config from '~/config';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faMagnifyingGlass, faPencilSquare, faSignIn } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx('wrapper')}>

            <div className={cx('inner')}>
                <div className={cx('logo')}>
                    <Link to={config.routes.home}> <img src={images.logo} alt='logo'></img></Link>
                </div>

                <div className={cx('search')}>
                    <input placeholder='Tìm kiếm...' spellCheck={false}></input>
                    <button className={cx('search-btn')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>

                <div className={cx('actions')}>
                    <Button text leftIcon={<FontAwesomeIcon icon={faSignIn}></FontAwesomeIcon>}>Đăng nhập</Button>
                    <Button text leftIcon={<FontAwesomeIcon icon={faPencilSquare}></FontAwesomeIcon>}>Đăng ký</Button>
                    <Button text leftIcon={<FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>}>Cart</Button>
                </div>
            </div>
        </header>
    );
}

export default Header;