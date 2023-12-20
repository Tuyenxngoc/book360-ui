import MoneyDisplay from '~/components/MoneyDisplay';

import Style from './MagageOrders.module.scss';
import classNames from 'classnames/bind';
import { Button, Chip } from '@mui/material';
import DateTimeDisplay from '~/components/DateTimeDisplay';

const cx = classNames.bind(Style);

const billStatus = [
    { status: 'Chờ xử lý', color: 'warning' },
    { status: 'Đang giao hàng', color: 'warning' },
    { status: 'Đặt hàng thành công', color: 'success' },
    { status: 'Đã giao', color: 'success' },
    { status: 'Đã hủy', color: 'error' },
]
function getChipByStatus(status) {
    const config = billStatus.find(item => item.status === status)
    return (
        <Chip
            size='small'
            color={config.color}
            label={config.status}
        />
    )
}

function TableOrders({ listOrder, fetchListOrder }) {

    const handleClickBtnUpdate = (order) => {
    }

    const handleClickBtnView = (order) => {
    }

    return (
        <div>
            <table className='table table-hover table-bordered' style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th scope='col'>Tên khách hàng</th>
                        <th scope='col'>Tổng Đơn hàng</th>
                        <th scope='col'>Ngày tạo đơn</th>
                        <th scope='col'>Tình trạng</th>
                        <th scope='col'>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listOrder && listOrder.length > 0 ? (
                        listOrder.map((item, index) => {
                            return (
                                <tr key={`table-orders-${index}`}>
                                    <td>{item.customer?.name}</td>
                                    <td>
                                        <span className='price'> <MoneyDisplay amount={item.total} /></span>
                                        <div className={cx('payment-method')}>Thanh toán khi nhận hàng</div>
                                    </td>
                                    <td><DateTimeDisplay datetime={item.createdDate} /></td>
                                    <td>
                                        {getChipByStatus(item.status)}
                                    </td>
                                    <td>
                                        <Button size='small' variant='contained' color='success' onClick={() => handleClickBtnView(item)}>
                                            Xem
                                        </Button>
                                        <Button size='small' className='mx-2' variant='contained' color='warning' onClick={() => handleClickBtnUpdate(item)}>
                                            Cập nhật
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan='6'>
                                <div className={cx('no-result')}>
                                    <div className={cx('icon')} />
                                    <div className={cx('text')}>Không tìm thấy đơn hàng</div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TableOrders;