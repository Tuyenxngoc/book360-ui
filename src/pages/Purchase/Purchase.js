import { axiosPrivate } from '~/utils/httpRequest';
import useAuth from '~/hooks/useAuth';
import Bill from '~/components/Bill';
import { useState, useEffect } from 'react';
import { buyAgain, cancelOrder } from '~/services/billService';
import { Tab, Tabs } from '@mui/material';

import Style from './Purchase.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

const BILL_STATUS = ["Tất cả", "Chờ xử lý", "Đặt hàng thành công", "Đang giao hàng", "Đã giao", "Đã hủy"];

function Purchase() {

    const { customer } = useAuth();
    const [value, setValue] = useState(0);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const fetchData = () => {
        axiosPrivate.get(`bill/get-bills/${customer.customerId}`)
            .then((response) => {
                setData(response.data.data.items);
                setFilteredData(response.data.data.items);
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
        const filtered = value === 0 ? data : data.filter(item => item.status === BILL_STATUS[value]);
        setFilteredData(filtered);
    }, [value, data]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCancelOrder = (billId) => {
        cancelOrder(customer.customerId, billId)
            .then((response) => {
                console.log(response);
                fetchData();
            })
            .catch((error) => { console.log(error); })
    }

    const handleBuyAgain = (billId) => {
        buyAgain(customer.customerId, billId)
            .then((response) => {
                console.log(response);
                fetchData();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <>
            <Tabs className={cx('bill-status')} value={value} onChange={handleChange}>
                {BILL_STATUS.map((status, index) => (<Tab key={index} label={status} />))}
            </Tabs>
            {
                filteredData.length > 0 ? (
                    filteredData.map((data, index) =>
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

