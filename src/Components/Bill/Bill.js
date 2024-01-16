import PropTypes from 'prop-types';

import DateTimeDisplay from '~/components/DateTimeDisplay';
import MoneyDisplay from '~/components/MoneyDisplay';

import { Button } from '@mui/material';

import Style from './Bill.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(Style);

function Bill({ data, handleCancelOrder, handleBuyAgain }) {

    const hanldeButtonCancelClick = () => { handleCancelOrder(data.id) }
    const hanldeButtonBuyAgainClick = () => { handleBuyAgain(data.id) }

    return (
        <div className={cx('orderItem')}>

            <div className={cx('header')}>
                <div className={cx('header-item')}>
                    <div>Người nhận: {data.consigneeName}</div>
                    <div>Ngày đặt: <DateTimeDisplay datetime={data.createdDate} /></div>
                </div>
                <div className={cx('header-item')}>
                    <div className={cx('status')}>{data.orderStatus}</div>
                </div>
            </div>

            <div className={cx('content')}>
                {data.billDetails.map((bill, index) => {
                    const product = bill.product;
                    return (
                        <div key={index} className={cx('product')}>
                            <div className={cx('product-detail')}>
                                <div className={cx('product-img')}>
                                    <Link to={`/product/${product.productId}`}>
                                        <img src={product.image} alt={product.name} />
                                    </Link>
                                </div>

                                <div className={cx('product-name')}>
                                    <div>
                                        <Link className={cx('name')} to={`/product/${product.productId}`}>{product.name} </Link>
                                    </div>
                                    <div>
                                        <span>x{bill.quantity}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('product-price')}>
                                <span><s><MoneyDisplay amount={product.price} /></s></span>
                                <span> <MoneyDisplay amount={product.price} discountPercent={product.discount} /></span>
                            </div>
                        </div>
                    )
                })}

            </div>

            <div className={cx('action')}>
                <div className={cx('total-price')}>
                    Thành tiền:&nbsp;<strong><MoneyDisplay amount={data.totalAmount} /></strong>
                </div>

                {data.status === "Chờ xử lý" ? (
                    <div className={cx('button')}>
                        <Button onClick={hanldeButtonBuyAgainClick} variant='contained' disabled>Chờ</Button>
                    </div>
                ) : (
                    data.status !== "Đang giao hàng" && (
                        <div className={cx('button')}>
                            <Button onClick={hanldeButtonBuyAgainClick} variant='contained'>Mua lại</Button>
                        </div>
                    )
                )}

                <div className={cx('button')}>
                    <Button onClick={hanldeButtonCancelClick} variant='outlined'>Liên hệ</Button>
                </div>

                {data.status === "Chờ xử lý" && (
                    <div className={cx('button')}>
                        <Button onClick={hanldeButtonCancelClick} variant='outlined'>Hủy đơn hàng</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

Bill.propTypes = {
    data: PropTypes.shape({
        customer: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        createdDate: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        billDetail: PropTypes.arrayOf(PropTypes.shape({
            product: PropTypes.object.isRequired,
        })).isRequired,
    }).isRequired,
};

export default Bill;