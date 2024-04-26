import { useState, useEffect } from 'react';

import Bill from '~/components/User/Bill';
import { cancelOrder, getBills, getCountBillByStatus } from '~/services/billService';
import { Tab, Tabs } from '@mui/material';

import Style from './Purchase.module.scss';
import classNames from 'classnames/bind';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import { addProductToCart } from '~/services/cartService';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(Style);

const billStatus = [
    { label: 'Tất cả', isShowOrderCounts: false, key: '' },
    { label: 'Chờ xác nhận', isShowOrderCounts: true, key: 'WAIT_FOR_CONFIRMATION' },
    { label: 'Chờ lấy hàng', isShowOrderCounts: true, key: 'WAIT_FOR_DELIVERY' },
    { label: 'Đang giao', isShowOrderCounts: true, key: 'DELIVERING' },
    { label: 'Đã giao', isShowOrderCounts: false, key: 'DELIVERED' },
    { label: 'Đã hủy', isShowOrderCounts: false, key: 'CANCELLED' },
    { label: 'Hoàn tiền', isShowOrderCounts: false, key: 'REFUND' },
];

function Purchase() {

    const navigate = useNavigate();
    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const [billsData, setBillsData] = useState([]);

    const fetchData = async () => {
        const params = queryString.stringify({ billStatus: billStatus[selectedTabIndex].key });
        try {
            const response = await getBills(params);
            setBillsData(response.data.data);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lấy dữ liệu đơn hàng');
        }
    };

    const getCountBill = async () => {
        for (let i = 0; i < billStatus.length; i++) {
            const item = billStatus[i];
            if (item.isShowOrderCounts) {
                try {
                    const response = await getCountBillByStatus(item.key);
                    const count = response.data.data;
                    billStatus[i] = { ...item, count };
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    const handleTabChange = (event, newIndex) => {
        setSelectedTabIndex(newIndex);
    };

    const handleCancelOrder = (billId) => {
        const params = queryString.stringify({ cancellationReason: 'none' });
        cancelOrder(billId, params)
            .then((response) => {
                fetchData();
                getCountBill();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleBuyAgain = async ({ billDetails }) => {
        try {
            const productIdSelect = [];
            const promises = billDetails.map(async (item) => {
                const productId = item.product.productId;
                productIdSelect.push(productId);
                await addProductToCart(productId, item.quantity);
            });

            await Promise.all(promises);
            navigate('/cart', { replace: true, state: { productIdSelect } });

            console.log('Tất cả các sản phẩm đã được thêm vào giỏ hàng.');
        } catch (error) {
            navigate('/cart', { replace: true });
            console.error('Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        }
    }

    const handleGetCountBill = (item) => {
        const count = item.count;
        if (count && count > 0) {
            return `(${count})`;
        }
        return '';
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTabIndex]);

    useEffect(() => {
        getCountBill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Tabs className={cx('bill-status')} value={selectedTabIndex} onChange={handleTabChange}>
                {billStatus.map((item, index) => (
                    <Tab
                        key={index}
                        label={
                            <div>
                                <span>{item.label}</span>
                                <span className={cx('count-bill')}>{item.isShowOrderCounts ? handleGetCountBill(item) : ''}</span>
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

