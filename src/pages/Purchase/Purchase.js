import { useState, useEffect } from 'react';

import useAuth from '~/hooks/useAuth';
import Bill from '~/components/Bill';
import { buyAgain, cancelOrder, getBillsByCustomerId } from '~/services/billService';
import { Tab, Tabs } from '@mui/material';

import Style from './Purchase.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

const BILL_STATUS = [
    { label: "Tất cả", isShowOrderCounts: false },
    { label: "Chờ xử lý", isShowOrderCounts: true },
    { label: "Đặt hàng thành công", isShowOrderCounts: true },
    { label: "Đang giao hàng", isShowOrderCounts: true },
    { label: "Đã giao", isShowOrderCounts: true },
    { label: "Đã hủy", isShowOrderCounts: false },
];

function Purchase() {

    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [billsData, setBillsData] = useState([]);
    const [filteredBillsData, setFilteredBillsData] = useState([]);
    const [orderCounts, setOrderCounts] = useState(Array(BILL_STATUS.length).fill(0));

    const fetchData = () => {
        getBillsByCustomerId()
            .then((response) => {
                const { items } = response.data.data;
                setBillsData(items);
                setFilteredBillsData(items);
                // Tính toán số lượng đơn hàng cho mỗi loại
                const counts = BILL_STATUS.map(status =>
                    items.filter(item => item.status === status.label).length
                );
                setOrderCounts(counts);
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
        const filtered = selectedTabIndex === 0
            ? billsData
            : billsData.filter(item => item.status === BILL_STATUS[selectedTabIndex].label);
        setFilteredBillsData(filtered);
    }, [selectedTabIndex, billsData]);

    const handleTabChange = (event, newIndex) => {
        setSelectedTabIndex(newIndex);
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
        buyAgain(billId)
            .then((response) => {
                console.log(response);
                fetchData();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const calculateTotalOrderCounts = (index) => {
        const total = orderCounts[index];

        return total === 0 ? '' : `(${total})`;
    };

    return (
        <>
            <Tabs className={cx('bill-status')} value={selectedTabIndex} onChange={handleTabChange}>
                {BILL_STATUS.map((status, index) => (
                    <Tab
                        key={index}
                        label={`${status.label} ${status.isShowOrderCounts ? calculateTotalOrderCounts(index) : ''}`}
                    />
                ))}
            </Tabs>
            {
                filteredBillsData.length > 0 ? (
                    filteredBillsData.map((data, index) =>
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

