import { Button } from "@mui/material";
import images from "~/assets";

import Style from './Profile.module.scss';
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faClipboard, faUser } from "@fortawesome/free-regular-svg-icons";
import useAuth from "~/hooks/useAuth";
import { Link } from "react-router-dom";

const cx = classNames.bind(Style);

function Profile() {

    const { user, customer } = useAuth();

    const handleSubmit = () => {
        alert('coming soon');
    }

    return (
        <div className="container my-3">
            <div className="row">
                <div className="col-2">
                    <div className={cx('sidebar')}>
                        <ul>
                            <li>
                                <Link to="/profile">
                                    <span className={cx('icon')}><FontAwesomeIcon icon={faUser} /></span>
                                    <span>Tài khoản của tôi</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/purchase">
                                    <span className={cx('icon')}><FontAwesomeIcon icon={faClipboard} /></span>
                                    <span>Đơn mua</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/">
                                    <span className={cx('icon')}><FontAwesomeIcon icon={faBell} /></span>
                                    <span>Thông báo</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-10">
                    <div className={cx('main-content')}>
                        <div className="row">
                            <div className="col-12">
                                <div className={cx('header')}>
                                    <h3 className={cx('title')}>Hồ sơ của tôi</h3>
                                    <div className={cx('description')}>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
                                </div>
                            </div>
                        </div>

                        <div className="row pt-4">
                            <div className="col-8">
                                <form>
                                    <div className={cx('form-group')}>
                                        <label>Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            disabled
                                            defaultValue={customer.name}
                                        />
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label>Tên</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                        />
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label>Email</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            defaultValue={user.email}
                                        />
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label>Số điện thoại</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            defaultValue={customer.phonenumber}
                                        />
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label>Địa chỉ</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            defaultValue={customer.address}
                                        />
                                    </div>
                                    <div className={cx('form-group')}>
                                        <label></label>
                                        <Button onClick={handleSubmit} size="small" variant="contained">Lưu</Button>
                                    </div>
                                </form>
                            </div>

                            <div className="col-4">
                                <div className={cx('user-avt')}>
                                    <div>
                                        <img className={cx("avatar")} src={images.userDefault} alt="avatar"></img>
                                    </div>
                                    <input type="file" />
                                    <Button size="small" variant="outlined">Chọn ảnh</Button>
                                    <div className={cx('file-description')}>
                                        <div>Dụng lượng file tối đa 1 MB</div>
                                        <div>Định dạng:.JPEG, .PNG</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;