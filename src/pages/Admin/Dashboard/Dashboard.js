import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Avatar } from '@mui/material';
import { DollarCircleOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import { Space } from 'antd';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import DashBoardCard from '~/components/Admin/AdminDashBoardCard';

import Style from './Dashboard.module.scss';
import classNames from 'classnames/bind';

import { getCountCustomer, getTodos } from '~/services/customerService';
import { getStockQuantity } from '~/services/productService';
import { getCountBill, getKeyMetrics } from '~/services/billService';
import { toast } from 'react-toastify';
import MoneyDisplay from '~/components/Common/MoneyDisplay';

const cx = classNames.bind(Style);

const dataUser = [
    {
        timestamp: 'Page A',
        uv: 4000,
        pv: 2000,
        amt: 2400,
    },
    {
        timestamp: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        timestamp: 'Page C',
        uv: 2000,
        pv: 3400,
        amt: 2290,
    },
    {
        timestamp: 'Page D',
        uv: 2780,
        pv: 3008,
        amt: 2000,
    },
    {
        timestamp: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        timestamp: 'Page F',
        uv: 2390,
        pv: 2800,
        amt: 2500,
    },
    {
        timestamp: 'Page G',
        uv: 3490,
        pv: 4700,
        amt: 2100,
    },
];

const dataProducts = [
    {
        timestamp: 'Page A',
        uv: 4000,
        pv: 2300,
        amt: 2400,
    },
    {
        timestamp: 'Page B',
        uv: 3000,
        pv: 1998,
        amt: 2210,
    },
    {
        timestamp: 'Page C',
        uv: 2000,
        pv: 3000,
        amt: 2290,
    },
    {
        timestamp: 'Page D',
        uv: 2780,
        pv: 4008,
        amt: 2000,
    },
    {
        timestamp: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        timestamp: 'Page F',
        uv: 2390,
        pv: 3000,
        amt: 2500,
    },
    {
        timestamp: 'Page G',
        uv: 3490,
        pv: 6500,
        amt: 2100,
    },
];

const dataRevenue = [
    {
        timestamp: 'Page A',
        uv: 4000,
        pv: 1000,
        amt: 2400,
    },
    {
        timestamp: 'Page B',
        uv: 3000,
        pv: 1998,
        amt: 2210,
    },
    {
        timestamp: 'Page C',
        uv: 2000,
        pv: 200,
        amt: 2290,
    },
    {
        timestamp: 'Page D',
        uv: 2780,
        pv: 3200,
        amt: 2000,
    },
    {
        timestamp: 'Page E',
        uv: 1890,
        pv: 3600,
        amt: 2181,
    },
    {
        timestamp: 'Page F',
        uv: 2390,
        pv: 2000,
        amt: 2500,
    },
    {
        timestamp: 'Page G',
        uv: 3490,
        pv: 4000,
        amt: 2100,
    },
];

const TODO = [
    { lable: 'Chờ xác nhận', link: '/admin/order?type=WAIT_FOR_CONFIRMATION', key: 'waitForConfirmationCount' },
    { lable: 'Chờ lấy hàng', link: '/admin/order?type=WAIT_FOR_DELIVERY', key: 'waitForDeliveryCount' },
    { lable: 'Đã xử lý', link: '/admin/order?type=DELIVERED', key: 'deliveringCount' },
    { lable: 'Đơn hủy', link: '/admin/order?type=CANCELLED', key: 'cancelledCount' },
    { lable: 'Sản phẩm hết hàng', link: '/admin/product', key: 'productSoldOut' },
];

const customer = [
    {
        name: 'tuyenngoc',
        avatar: 'https://material-kit-pro-react.devias.io/assets/avatars/avatar-alcides-antonio.png',
        createdDate: '',
        link: '',
        message: 'Hello, we spoke earlier on the phone',
    },
    {
        name: 'Alcides Antonio',
        avatar: 'https://material-kit-pro-react.devias.io/assets/avatars/avatar-marcus-finn.png',
        createdDate: '',
        link: '',
        message: 'Is the job still available?',
    },
    {
        name: 'Jie Yan Song',
        avatar: 'https://material-kit-pro-react.devias.io/assets/avatars/avatar-carson-darrin.png',
        createdDate: '',
        link: '',
        message: 'What is a screening task? I’d like to',
    },
    {
        name: 'tuyenngoc',
        avatar: 'https://material-kit-pro-react.devias.io/assets/avatars/avatar-fran-perez.png',
        createdDate: '',
        link: '',
        message: 'What is a screening task? I’d like to',
    },
    {
        name: 'Carson Darrin',
        avatar: 'https://material-kit-pro-react.devias.io/assets/avatars/avatar-jie-yan-song.png',
        createdDate: '',
        link: '',
        message: 'Is the job still available?',
    },
];

function formatNumberWithPercent(value) {
    if (typeof value !== 'undefined' && value !== null && !isNaN(value)) {
        return value.toFixed(2) + '%';
    } else {
        return '0.00 %';
    }
}

function Dashboard() {
    const [countCustomer, setCountCustomer] = useState(0);
    const [countProducts, setCountProducts] = useState(0);
    const [countBills, setCountBills] = useState(0);

    const [todos, setTodos] = useState({});
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [customerResponse, productsResponse, billsResponse, todosResponse] = await Promise.all([
                    getCountCustomer(),
                    getStockQuantity(),
                    getCountBill(),
                    getTodos(),
                ]);

                setCountCustomer(customerResponse.data.data);
                setCountProducts(productsResponse.data.data);
                setCountBills(billsResponse.data.data);
                setTodos(todosResponse.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();

        getKeyMetrics()
            .then((response) => {
                setData(response.data.data);
            })
            .catch((error) => {
                toast.error('Đã có lỗi xảy ra khi lấy dữ liệu.');
            });
    }, []);

    return (
        <div className="container mt-2">
            <div className="row g-2">
                <div className="col-12">
                    <Space size={20} direction="vertical">
                        <Space
                            direction="horizontal"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            <DashBoardCard
                                icon={
                                    <ShoppingCartOutlined
                                        style={{
                                            color: 'green',
                                            backgroundColor: 'rgba(16, 236, 16, 0.25)',
                                            borderRadius: 20,
                                            fontSize: 24,
                                            padding: 8,
                                        }}
                                    />
                                }
                                title={'Số đơn đặt hàng'}
                                value={countBills}
                                data={dataUser}
                            />
                            <DashBoardCard
                                icon={
                                    <UserOutlined
                                        style={{
                                            color: 'purple',
                                            backgroundColor: 'rgba(203, 127, 236, 0.5)',
                                            borderRadius: 20,
                                            fontSize: 24,
                                            padding: 8,
                                        }}
                                    />
                                }
                                title={'Tổng số khách hàng'}
                                value={countCustomer}
                                data={dataUser}
                            />
                            <DashBoardCard
                                icon={
                                    <DollarCircleOutlined
                                        style={{
                                            color: 'red',
                                            backgroundColor: 'rgba(244, 12, 12, 0.2)',
                                            borderRadius: 20,
                                            fontSize: 24,
                                            padding: 8,
                                        }}
                                    />
                                }
                                title={'Doanh thu'}
                                value={0}
                                data={dataRevenue}
                            />
                            <DashBoardCard
                                icon={
                                    <ShoppingOutlined
                                        style={{
                                            color: 'blue',
                                            backgroundColor: 'rgba(21, 202, 238, 0.25)',
                                            borderRadius: 20,
                                            fontSize: 24,
                                            padding: 8,
                                        }}
                                    />
                                }
                                title={'Số hàng tồn kho'}
                                value={countProducts}
                                data={dataProducts}
                            />
                        </Space>
                    </Space>
                </div>

                <div className="col-12">
                    <div className="row g-2">
                        <div className="col-8">
                            <div className="row g-2">
                                <div className="col-12">
                                    <div className={cx('cart')}>
                                        <div className={cx('title')}>
                                            Danh sách cần làm
                                            <p className={cx('card-tips')}> Những việc bạn sẽ phải làm </p>
                                        </div>

                                        <div className="cart-content">
                                            <div className="row">
                                                {TODO.map((item, index) => (
                                                    <div key={index} className={cx('cart-item', 'col-3')}>
                                                        <Link to={item.link} className={cx('cart-item-link')}>
                                                            <p className={cx('item-title')}>{todos[item.key]}</p>
                                                            <span className={cx('item-desc')}>{item.lable}</span>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className={cx('cart')}>
                                        <div className={cx('title')}>
                                            Phân Tích Bán Hàng
                                            <p className={cx('card-tips')}>
                                                {' '}
                                                Tổng quan dữ liệu của shop đối với đơn hàng đã tạo{' '}
                                            </p>
                                        </div>

                                        <div className="cart-content">
                                            <div className="row">
                                                <div className="col-7" style={{ height: '300px' }}>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <LineChart data={data.timeSeries}>
                                                            <CartesianGrid horizontal={false} vertical={false} />
                                                            <XAxis dataKey="timestamp" type="number" />
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Line
                                                                name="Số đơn"
                                                                dataKey="value"
                                                                stroke="#78abfc"
                                                                dot={false}
                                                            />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                </div>
                                                <div className="col-5">
                                                    <div className="row gy-5">
                                                        <div className="col-6">
                                                            <div className={cx('item-box')}>
                                                                <div className={cx('item-title')}> Doanh số </div>
                                                                <div className={cx('item-number')}>
                                                                    {' '}
                                                                    <MoneyDisplay amount={data.sales || 0} />{' '}
                                                                </div>
                                                                <div className={cx('item-increase')}>
                                                                    {' '}
                                                                    Vs hôm qua{' '}
                                                                    {formatNumberWithPercent(data.salesPctDiff)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className={cx('item-box')}>
                                                                <div className={cx('item-title')}> Đơn hàng </div>
                                                                <div className={cx('item-number')}> {data.orders} </div>
                                                                <div className={cx('item-increase')}>
                                                                    {' '}
                                                                    Vs hôm qua{' '}
                                                                    {formatNumberWithPercent(data.ordersPctDiff)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className={cx('item-box')}>
                                                                <div className={cx('item-title')}>
                                                                    {' '}
                                                                    Số lượng đã bán{' '}
                                                                </div>
                                                                <div className={cx('item-number')}>
                                                                    {' '}
                                                                    {data.products}{' '}
                                                                </div>
                                                                <div className={cx('item-increase')}>
                                                                    {' '}
                                                                    Vs hôm qua{' '}
                                                                    {formatNumberWithPercent(data.productsPctDiff)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className={cx('item-box')}>
                                                                <div className={cx('item-title')}> Lượt truy cập </div>
                                                                <div className={cx('item-number')}> 0 </div>
                                                                <div className={cx('item-increase')}>
                                                                    {' '}
                                                                    Vs hôm qua 0,00%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="row">
                                <div className="col-12">
                                    <div className={cx('cart')}>
                                        <div className="cart-header">
                                            <div className={cx('title')}>
                                                Tin nhắn
                                                <p className={cx('card-tips')}></p>
                                            </div>
                                        </div>
                                        <div className="cart-content">
                                            <div className="row">
                                                {customer.map((item, index) => (
                                                    <div key={index} className={cx('user-cart-item', 'col-12')}>
                                                        <div className={cx('user-info-container')}>
                                                            <Avatar
                                                                className={cx('user-avatar')}
                                                                alt={item.name}
                                                                src={item.avatar}
                                                            />
                                                            <div className={cx('user-info')}>
                                                                <h6>{item.name}</h6>
                                                                <span>{item.message}</span>
                                                            </div>
                                                        </div>

                                                        <div className={cx('timestamp-info')}>
                                                            <span>3 giờ trước</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
