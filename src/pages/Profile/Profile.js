import { Button } from "@mui/material";
import images from "~/assets";

import Style from './Profile.module.scss';
import classNames from "classnames/bind";

import useAuth from "~/hooks/useAuth";

const cx = classNames.bind(Style);

function Profile() {

    const { user, customer } = useAuth();

    const handleSubmit = () => {
        alert('coming soon');
    }

    return (
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
    );
}

export default Profile;