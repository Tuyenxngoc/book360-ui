import Button from "../Button";
import Style from "./Footer.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

function Footer() {
    const contact = {
        address: '213 Dương Đình Nghệ',
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
                                <a href="/" className={cx('link')}>Thông tin tài khoản</a>
                            </li>
                            <li className={cx('item')}>
                                <a href="/" className={cx('link')}>Giỏ hàng</a>
                            </li>
                            <li className={cx('item')}>
                                <a href="/" className={cx('link')}>Danh sách ưa thích</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-3">
                        <h3 className={cx('title')}>Khuyến mãi và ưu đãi</h3>
                        <div className={cx('item')}>Đăng ký nhận thông tin tại đây</div>
                        <input className={cx('input')} type="email" placeholder="Nhập email..."></input>
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