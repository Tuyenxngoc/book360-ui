import PropTypes from 'prop-types';
import DateTimeDisplay from '../DateTimeDisplay';
import Product from '../Product';

import Style from './PurchaseTab.module.scss';
import classNames from 'classnames/bind';
import MoneyDisplay from '../MoneyDisplay';
import { Button } from '@mui/material';

const cx = classNames.bind(Style);

function PurchaseTab({ data, handleCancelOrder, handleBuyAgain }) {

    console.log('render');
    const hanldeButtonCancelClick = () => { handleCancelOrder(data.id) }
    const hanldeButtonBuyAgainClick = () => { handleBuyAgain(data.id) }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('header-item')}>
                    <div>Người nhận: {data.customer.name}</div>
                    <div>Ngày đặt: <DateTimeDisplay datetime={data.createdDate} /></div>
                    <div>{data.status}</div>
                </div>
                <div className={cx('header-item')}>
                    <div>Tổng tiền:</div>
                    <div><MoneyDisplay amount={data.feeShip} /></div>
                </div>
            </div>
            <div className={cx('content')}>
                <div className={cx('product')}>
                    {data.billDetail.map((bill, index) => (
                        <div key={index} >
                            <Product data={bill.product} small></Product>
                        </div>
                    ))}
                </div>
                <div className={cx('action')}>
                    <Button onClick={hanldeButtonBuyAgainClick} variant='contained'>Mua lại</Button>
                    <Button onClick={hanldeButtonCancelClick} variant='contained'>Hủy</Button>
                </div>
            </div>
        </div>
    );
}

PurchaseTab.propTypes = {
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

export default PurchaseTab;