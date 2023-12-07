import Style from './Notification.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);
function Notification() {
    return (
        <div className={cx('main-content')}>
            <div className="row">
                <div className="col-12">
                    <div className={cx('header')}>
                        <h3 className={cx('title')}>Cài đặt thông báo</h3>
                    </div>
                </div>
            </div>

            <div className="row pt-4">
                <div className="col">
                    <div>Trang này đang được phát triển</div>
                </div>
            </div>
        </div>
    );
}

export default Notification;