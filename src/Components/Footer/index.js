import { Link } from "react-router-dom";
import Button from "../Button";
import Style from "./Footer.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

function Footer() {
    const contact = {
        address: 'Số 298 Đ. Cầu Diễn, Minh Khai, Bắc Từ Liêm, Hà Nội',
        phoneNumber: '0977-232-223',
        email: 'tuyenn9448@gmail.com'
    }
    return (
        <div className={cx('wrapper')}>
            <div className="container">
                <div className="row">
                    <div className="col-3">
                        <h2 className={cx('title')}>BOOK360</h2>
                        <ul className={cx('list')}>
                            <li className={cx('item')} >{`Địa chỉ: ${contact.address}`}</li>
                            <li className={cx('item')} >{`Số điện thoại: ${contact.phoneNumber}`}</li>
                            <li className={cx('item')} >{`Email: ${contact.email}`}</li>
                        </ul>
                    </div>
                    <div className="col-3">
                        <h3 className={cx('title')}>Cửa hàng</h3>
                        <ul className={cx('list')}>
                            <li className={cx('item')} >
                                <a href="/" className={cx('link')}>Liên hệ</a>
                            </li>
                            <li className={cx('item')} >
                                <a href="/" className={cx('link')}>Thông tin về chúng tôi</a>
                            </li>
                            <li className={cx('item')} >
                                <a href="/" className={cx('link')}>Sản phẩm kính doanh</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-3">
                        <h3 className={cx('title')}>Tài khoản</h3>
                        <ul className={cx('list')}>
                            <li className={cx('item')}>
                                <Link to="/profile" className={cx('link')}>Thông tin tài khoản</Link>
                            </li>
                            <li className={cx('item')}>
                                <Link to="/cart" className={cx('link')}>Giỏ hàng</Link>
                            </li>
                            <li className={cx('item')}>
                                <a href="/" className={cx('link')}>Danh sách ưa thích</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-3">
                        <h3 className={cx('title')}>Khuyến mãi và ưu đãi</h3>
                        <div className={cx('item')}>Đăng ký nhận thông tin tại đây</div>
                        <input
                            className={cx('input')}
                            id="emailInput"
                            name="email"
                            type="email"
                            placeholder="Nhập email..."
                            autoComplete="email"
                        ></input>
                        <Button primary>Đăng ký</Button>
                    </div>
                </div></div>

            <div className={cx("copyrights")}>
                <div className="text-center">
                    Copyrights © 2021 by Book360. <a target="_blank" href="/">Powered by Tuyenngoc</a>
                </div>
            </div>
        </div>
    )
}

export default Footer;