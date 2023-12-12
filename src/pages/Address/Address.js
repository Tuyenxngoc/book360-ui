import Style from './Address.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

function Address() {

    return (
        <div className={cx('main-content')}>
            <div className="row">
                <div className="col-12">
                    <div className={cx('header')}>
                        <h3 className={cx('title')}>Địa chỉ của tôi</h3>
                    </div>
                </div>
            </div>

            <div className="row pt-4">
                <div className="col">
                    <div>Trang này đang được cập nhật vui lòng thử lại sau</div>
                </div>
            </div>
        </div>
    );
}

export default Address;