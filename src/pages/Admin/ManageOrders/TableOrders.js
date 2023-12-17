import MoneyDisplay from '~/components/MoneyDisplay';

import Style from './MagageOrders.module.scss';
import classNames from 'classnames/bind';
import { Button, Chip } from '@mui/material';
import DateTimeDisplay from '~/components/DateTimeDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
/**
 * 
*   'createdDate': '2023-12-15T15:23:38.399741',
    'lastModifiedDate': '2023-12-15T15:23:38.466559',
    'id': 2,
    'status': 'Chờ xử lý',
    'feeShip': 30000,
    'total': 89500,
    'billDetail': [],
    'customer': {
        'createdDate': '2023-12-13T21:17:32.832814',
        'lastModifiedDate': '2023-12-14T08:35:35.541409',
        'id': 2,
        'name': 'tuyenngoc',
        'phonenumber': '0984176224',
        'address': '2 Xã Pải Lủng Huyện Mèo Vạc Tỉnh Hà Giang',
        'avatar': null,
        'favoriteProducts': []
    }
 */

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


function TableOrders({ listOrder, handleClickBtnUpdate, handleClickView, handleClickBtnDelete }) {
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
                                        <Button size='small' variant='contained' color='success' onClick={() => handleClickView(item.productId)}>
                                            Xem
                                        </Button>
                                        <Button size='small' className='mx-2' variant='contained' color='warning' onClick={() => handleClickBtnUpdate(item.productId)}>
                                            Cập nhật
                                        </Button>
                                        <Button size='small' variant='contained' color='error' onClick={() => handleClickBtnDelete(item.productId)}>
                                            Xoá
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan='6'>Not found data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TableOrders;