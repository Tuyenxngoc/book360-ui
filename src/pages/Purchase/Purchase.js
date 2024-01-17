import { useState, useEffect } from 'react';

import Bill from '~/components/Bill';
import { cancelOrder, getBills, getCountBills } from '~/services/billService';
import { Tab, Tabs } from '@mui/material';

import Style from './Purchase.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

const BILL_STATUS = [
    { label: "Tất cả", isShowOrderCounts: false, key: '' },
    { label: "Chờ xác nhận", isShowOrderCounts: true, key: 'unpaid' },
    { label: "Chờ lấy hàng", isShowOrderCounts: true, key: 'to_ship' },
    { label: "Đang giao", isShowOrderCounts: true, key: 'shipping' },
    { label: "Đã giao", isShowOrderCounts: false, key: 'completed' },
    { label: "Đã hủy", isShowOrderCounts: false, key: 'cancelled' },
];

function Purchase() {

    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [billsData, setBillsData] = useState([]);
    const [coutBills, setCoutBills] = useState({});

    const fetchData = (status) => {
        getBills(status)
            .then((response) => {
                const { items } = response.data.data;
                setBillsData(items);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getCountBills()
            .then((response) => {
                const { unpaid, toShip, shipping, completed, cancelled, refund } = response.data.data;
                setCoutBills({
                    'unpaid': unpaid,
                    'to_ship': toShip,
                    'shipping': shipping,
                    'completed': completed,
                    'cancelled': cancelled
                });
            })
            .catch((error) => {
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTabChange = (event, newIndex) => {
        setSelectedTabIndex(newIndex);
        fetchData(BILL_STATUS[newIndex].key);
    };

    const handleCancelOrder = (billId) => {
        cancelOrder(billId)
            .then((response) => {
                console.log(response);
                fetchData();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleBuyAgain = (billId) => {

    }

    const handleGetCountBill = (billStatus) => {
        const count = coutBills[billStatus];
        if (count && count > 0) {
            return `(${count})`;
        }
        return '';
    }

    return (
        <>
            <Tabs className={cx('bill-status')} value={selectedTabIndex} onChange={handleTabChange}>
                {BILL_STATUS.map((item, index) => (
                    <Tab
                        key={index}
                        label={
                            <div>
                                <span>{item.label}</span>
                                <span style={{ color: '#ee4d2d', marginLeft: '5px' }} >{item.isShowOrderCounts ? handleGetCountBill(item.key) : ''}</span>
                            </div>}
                    />
                ))}
            </Tabs>
            {
                billsData.length > 0 ? (
                    billsData.map((data, index) =>
                        <Bill
                            key={index}
                            data={data}
                            handleCancelOrder={handleCancelOrder}
                            handleBuyAgain={handleBuyAgain}
                        />)
                ) : (
                    <div className={cx('blank')}>
                        <div className={cx('no-orders')}></div>
                        <h2>Chưa có đơn hàng</h2>
                    </div>
                )
            }
        </>
    );
}

export default Purchase;

