import { DollarCircleOutlined, ShoppingCartOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import DashBoardCard from "~/components/AdminDashBoardCard";
import Style from './Dashboard.module.scss';
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { getCountCustomer } from "~/services/customerService";
import { getCountProducts } from "~/services/productService";
import { getCountBills } from "~/services/billService";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
const cx = classNames.bind(Style);

const dataUser = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2000,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 3400,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3008,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 2800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4700,
        amt: 2100,
    },
];

const dataProducts = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2300,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1998,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 3000,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 4008,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3000,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 6500,
        amt: 2100,
    },
];

const dataRevenue = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 1000,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1998,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 200,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3200,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 3600,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 2000,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4000,
        amt: 2100,
    },
];

const todo = [
    { lable: 'Chờ xác nhận', link: '/admin/orders?type=to_pay' },
    { lable: 'Chờ lấy hàng', link: '/admin/orders?type=unpaid' },
    { lable: 'Đã xử lý', link: '/admin/orders?type=success' },
    { lable: 'Đơn hủy', link: '/admin/orders?type=canceled' },
    { lable: 'Sản phẩm hết hàng', link: '/admin/products' },
]

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
]

function Dashboard() {

    const [countCustomer, setCountCustomer] = useState(0);
    const [countProducts, setCountProducts] = useState(0);
    const [countBills, setCountBills] = useState(0);

    useEffect(() => {
        getCountCustomer()
            .then((response) => {
                setCountCustomer(response.data.data)
            })
            .catch((error) => { console.log(error); })
        getCountProducts()
            .then((response) => {
                setCountProducts(response.data.data)
            })
            .catch((error) => { console.log(error); })
        getCountBills()
            .then((response) => {
                setCountBills(response.data.data)
            })
            .catch((error) => { console.log(error); })
    }, []);

    return (
        <div className="container mt-2">
            <div className="row g-2">
                <div className="col-12">
                    <Space size={20} direction="vertical">
                        <Space direction="horizontal"
                            style={{
                                display: "flex",
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                width: '100%'
                            }}>
                            <DashBoardCard
                                icon={
                                    <ShoppingCartOutlined
                                        style={{
                                            color: "green",
                                            backgroundColor: "rgba(16, 236, 16, 0.25)",
                                            borderRadius: 20,
                                            fontSize: 24,
                                            padding: 8,
                                        }}
                                    />
                                }
                                title={"Số đơn đặt hàng"}
                                value={countBills}
                                data={dataUser}
                            />
                            <DashBoardCard
                                icon={
                                    <UserOutlined
                                        style={{
                                            color: "purple",
                                            backgroundColor: "rgba(203, 127, 236, 0.5)",
                                            borderRadius: 20,
                                            fontSize: 24,
                                            padding: 8,
                                        }}
                                    />
                                }
                                title={"Tổng số khách hàng"}
                                value={countCustomer}
                                data={dataUser}
                            />
                            <DashBoardCard
                                icon={
                                    <DollarCircleOutlined
                                        style={{
                                            color: "red",
                                            backgroundColor: "rgba(244, 12, 12, 0.2)",
                                            borderRadius: 20,
                                            fontSize: 24,
                                            padding: 8,
                                        }}
                                    />
                                }
                                title={"Doanh thu"}
                                value={0}
                                data={dataRevenue}
                            />
                            <DashBoardCard
                                icon={
                                    <ShoppingOutlined
                                        style={{
                                            color: "blue",
                                            backgroundColor: "rgba(21, 202, 238, 0.25)",
                                            borderRadius: 20,
                                            fontSize: 24,
                                            padding: 8,
                                        }}
                                    />
                                }
                                title={"Số hàng tồn kho"}
                                value={countProducts}
                                data={dataProducts}
                            />
                        </Space>
                    </Space>
                </div>

                <div className="col-8">
                    <div className={cx('cart')}>
                        <div className={cx('title')}>
                            Danh sách cần làm
                            <p className={cx('card-tips')}> Những việc bạn sẽ phải làm </p>
                        </div>

                        <div className='cart-content'>
                            <div className="row">
                                {todo.map((item, index) => (
                                    <div key={index} className={cx('cart-item', 'col-3')}>
                                        <Link
                                            to={item.link}
                                            className={cx('cart-item-link')}
                                        >
                                            <p className={cx('item-title')}>0</p>
                                            <span className={cx('item-desc')}>{item.lable}</span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className={cx('cart')}>
                        <div className='cart-header'>
                            <div className={cx('title')}>
                                Tin nhắn
                                <p className={cx('card-tips')}></p>
                            </div>
                        </div>
                        <div className='cart-content'>
                            <div className="row">
                                {customer.map((item, index) => (
                                    <div key={index} className={cx('user-cart-item', 'col-12')}>
                                        <div className={cx('user-info-container')}>
                                            <Avatar className={cx('user-avatar')} alt={item.name} src={item.avatar} />
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
    );
}

export default Dashboard;