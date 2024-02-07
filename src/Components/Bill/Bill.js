import PropTypes from 'prop-types';

import DateTimeDisplay from '~/components/DateTimeDisplay';
import MoneyDisplay from '~/components/MoneyDisplay';

import { Button } from '@mui/material';

import Style from './Bill.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(Style);

function Bill({ data: billData, handleCancelOrder, handleBuyAgain }) {

    const hanldeButtonCancelClick = () => { handleCancelOrder(billData.id) }
    const hanldeButtonBuyAgainClick = () => { handleBuyAgain(billData) }

    const buttonsToShow = [
        { label: 'Mua lại', onClick: hanldeButtonBuyAgainClick, variant: 'contained', disabled: false, condition: billData.billStatus === 'Đã hủy' || billData.billStatus === 'Đã giao' || billData.billStatus === 'TRẢ HÀNG/HOÀN TIỀN' },
        { label: 'Chờ', onClick: hanldeButtonBuyAgainClick, variant: 'contained', disabled: true, condition: billData.billStatus === 'Chờ xác nhận' || billData.billStatus === 'Chờ lấy hàng' || billData.billStatus === 'Đang giao' },
        { label: 'Liên hệ', onClick: hanldeButtonCancelClick, variant: 'outlined', disabled: false, condition: true },
        { label: 'Hủy đơn hàng', onClick: hanldeButtonCancelClick, variant: 'outlined', disabled: false, condition: billData.billStatus === 'Chờ xác nhận' },
    ];

    return (
        <div className={cx('orderItem')}>

            <div className={cx('header')}>
                <div className={cx('header-item')}>
                    <div>Người nhận: {billData.consigneeName}</div>
                    <div>Ngày đặt: <DateTimeDisplay datetime={billData.createdDate} /></div>
                </div>
                <div className={cx('header-item')}>
                    <div className={cx('status')}>{billData.billStatus}</div>
                </div>
            </div>

            <div className={cx('content')}>
                {billData.billDetails.map((bill, index) => {
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
                    Thành tiền:&nbsp;<strong><MoneyDisplay amount={billData.totalAmount} /></strong>
                </div>

                {buttonsToShow.map((button, index) => (
                    button.condition &&
                    <div key={index} className={cx('button')}>
                        <Button
                            onClick={button.onClick}
                            variant={button.variant}
                            disabled={button.disabled}
                        >
                            {button.label}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

Bill.propTypes = {
    data: PropTypes.shape({
        consigneeName: PropTypes.string.isRequired,
        createdDate: PropTypes.string.isRequired,
        billStatus: PropTypes.string.isRequired,
        billDetails: PropTypes.arrayOf(PropTypes.shape({
            product: PropTypes.shape({
                productId: PropTypes.number.isRequired,
                image: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired,
                discount: PropTypes.number.isRequired,
            }).isRequired,
            quantity: PropTypes.number.isRequired,
        })).isRequired,
        totalAmount: PropTypes.number.isRequired,
    }).isRequired,
    handleCancelOrder: PropTypes.func.isRequired,
    handleBuyAgain: PropTypes.func.isRequired,
};

export default Bill;