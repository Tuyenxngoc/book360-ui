import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MoneyDisplay from '~/components/Common/MoneyDisplay';
import DateTimeDisplay from '~/components/Common/DateTimeDisplay';

import Style from './MagageOrders.module.scss';
import classNames from 'classnames/bind';

import { Button, Chip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faPen } from '@fortawesome/free-solid-svg-icons';
import UpdateStatusDialog from './UpdateStatusDialog';

const cx = classNames.bind(Style);

const billStatus = [
    { label: 'Chờ xác nhận', status: 'WAIT_FOR_CONFIRMATION', color: 'warning' },
    { label: 'Chờ lấy hàng', status: 'WAIT_FOR_DELIVERY', color: 'warning' },
    { label: 'Đang giao', status: 'DELIVERING', color: 'warning' },
    { label: 'Đã giao', status: 'DELIVERED', color: 'success' },
    { label: 'Đã hủy', status: 'CANCELLED', color: 'error' },
    { label: 'Trả hàng/Hoàn tiền', status: 'REFUND', color: 'warning' },
    { label: 'Giao không thành công', status: 'DELIVERY_FAILED', color: 'error' },
]

function getChipByStatus(order, handleUpdateStatus) {

    const config = billStatus.find(item => item.status === order.billStatus);

    const handleDelete = () => {
        handleUpdateStatus(order);
    }

    return (
        <Chip
            size='small'
            color={config.color}
            label={config.label}
            clickable={true}
            onClick={handleDelete}
            onDelete={handleDelete}
            deleteIcon={
                <FontAwesomeIcon
                    icon={faPen}
                    style={{ fontSize: '10px', padding: '0 2px' }}
                />
            }
        />
    )
}

function TableOrders({ listOrder, fetchListOrder }) {

    const navigate = useNavigate();
    const [orderSelect, setOrderSelect] = useState({});
    const [isDialogUpdateStatusOpen, setIsDialogUpdateStatusOpen] = useState(false);

    const handleClickBtnUpdate = (order) => {
    }

    const handleClickBtnView = (orderId) => {
        navigate(`/admin/order/${orderId}`);
    }

    const handleUpdateStatus = (status) => {
        setOrderSelect(status);
        setIsDialogUpdateStatusOpen(true);
    }

    return (
        <div>
            <UpdateStatusDialog
                open={isDialogUpdateStatusOpen}
                setOpen={setIsDialogUpdateStatusOpen}
                dataOrder={orderSelect}
                fetchListOrder={fetchListOrder}
            />
            <table className='table table-striped table-bordered' style={{ verticalAlign: 'middle' }}>
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
                                    <td>{item.shippingName}</td>
                                    <td>
                                        <span className='price'> <MoneyDisplay amount={item.totalPrice + item.shippingFee} /></span>
                                        <div className={cx('payment-method')}>Thanh toán khi nhận hàng</div>
                                    </td>
                                    <td><DateTimeDisplay datetime={item.createdDate} /></td>
                                    <td>
                                        {getChipByStatus(item, handleUpdateStatus)}
                                    </td>
                                    <td>
                                        <Button
                                            size='small'
                                            variant='contained'
                                            color='success'
                                            onClick={() => handleClickBtnView(item.id)}
                                            sx={{ minWidth: 35, height: 35 }}
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                        <Button
                                            size='small'
                                            variant='contained'
                                            color='info'
                                            onClick={() => handleClickBtnUpdate(item)}
                                            sx={{ minWidth: 35, height: 35, ml: 1 }}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
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