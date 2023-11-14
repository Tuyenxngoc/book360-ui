import { Link } from "react-router-dom";
import Style from './NotFound.module.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(Style);

function NotFound() {

    return (
        <div className={cx('wrapper')}>
            <div className={cx('four_zero_four_bg')}>
                <h1 className="text-center">404</h1>
            </div>
            <span>Địa chỉ không hợp lệ</span>
            <span>Địa chỉ URL bạn yêu cầu không tìm thấy trên server.</span>
            <span>Có thể bạn gõ sai địa chỉ hoặc dữ liệu này đã bị xóa khỏi server.</span>
            <button type="button">
                <Link to='/'>Trở về trang chủ</Link>
            </button>
        </div>
    );
}

export default NotFound;
