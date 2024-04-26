import { Checkbox } from '@mui/material';
import Style from './Notification.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

const notificationTypes = [
    { title: 'Email Thông báo', body: '' },
    {
        title: 'Cập nhật đơn hàng',
        body: 'Thông báo khi có cập nhật về đơn hàng của tôi, bao gồm cả việc cập nhật thanh toán.',
    },
    { title: 'Bản tin', body: 'Gửi tôi thông tin xu hướng, chương trình khuyến mãi & cập nhật mới nhất.' },
    { title: 'Nội dung cá nhân', body: 'Gửi tôi cập nhật cá nhân (ví dụ: quà sinh nhật)' },
];

const renderNotification = ({ title, body }, index) => (
    <div key={index} className={cx('notification-wrapper')}>
        <div className={cx('notification-title')}>
            <div className={cx('notification-text')}>{title}</div>
            <div className={cx('notification-body')}>{body}</div>
        </div>
        <div className={cx('checkbox-container')}>
            <Checkbox {...label} defaultChecked />
            <div className={cx('label-activation')}>Kích hoạt</div>
        </div>
    </div>
);

const label = { inputProps: { 'aria-label': 'Checkbox' } };

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
                    <div className={cx('email')}>Thông báo Email</div>
                    {notificationTypes.map(renderNotification)}
                </div>
            </div>
        </div>
    );
}

export default Notification;
