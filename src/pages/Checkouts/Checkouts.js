//react
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
//Style
import Style from './Checkouts.module.scss';
import classNames from "classnames/bind";
//mui ui
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck, faCreditCard, faUserPen } from "@fortawesome/free-solid-svg-icons";
//component
import images from "~/assets";
import useAuth from "~/hooks/useAuth";
import Breadcrumb from "~/components/Breadcrumb";
import MoneyDisplay from "~/components/MoneyDisplay";
import { axiosPrivate } from "~/utils/httpRequest";

const cx = classNames.bind(Style);

function Checkouts() {
    const { user, customer } = useAuth();
    const location = useLocation();
    const memoizedListProducts = useMemo(() => {
        return location.state?.listProducts || [];
    }, [location.state]);
    const navigate = useNavigate();
    const listProducts = memoizedListProducts;
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingInfo, setShippingInfo] = useState({
        nameCustomer: user.username,
        phonenumber: customer.phonenumber,
        address: customer.address,
        listProductId: listProducts.map(item => item.productId),
    });

    useEffect(() => {
        const totalPrice = listProducts.reduce((sum, product) => {
            return sum + product.quantity * (product.price * (100 - product.discount) / 100);
        }, 0);
        setTotalPrice(totalPrice);
    }, [listProducts]);

    const handleShippingChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        axiosPrivate.post(`bill/order-from-cart/${customer.id}`, shippingInfo)
            .then(response => {
                console.log(response.data);
                navigate('/', { replace: true });
            })
            .catch(err => {
                console.error(err);
            });
    }

    if (listProducts.length === 0) {
        return (
            <>
                <p>No products selected.</p>
                <Link to={'/'}>Home</Link>
            </>
        );
    }

    return (
        <>
            <Breadcrumb
                breadcrumbs={[{ url: '/cart', label: 'Giỏ hàng của bạn' }]}
                currentPage={'Thanh toán'} />
            <div className="container">
                <div className="row g-2">
                    <div className="col-7">
                        <div className="row g-2">
                            <div className="col-12">
                                <div className={cx('wrapper')}>
                                    <div className={cx('title')}>
                                        <span className={cx('icon')}><FontAwesomeIcon icon={faUserPen} /></span>
                                        <span> Thông tin khách hàng</span>
                                    </div>
                                    <div className={cx('inner')}>
                                        <div className={cx('form-group')}>
                                            <label htmlFor="input-name">HỌ TÊN NGƯỜI NHẬN</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                id="input-name"
                                                placeholder="Họ tên người nhận"
                                                name="nameCustomer"
                                                value={shippingInfo.nameCustomer}
                                                onChange={handleShippingChange}
                                            />
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label htmlFor="input-phone-number">SỐ ĐIỆN THOẠI</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                id="input-phone-number"
                                                placeholder="Số điện thoại liên hệ khi giao hàng"
                                                name="phonenumber"
                                                value={shippingInfo.phonenumber}
                                                onChange={handleShippingChange}
                                            />
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label htmlFor="input-email">EMAIL</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                id="input-email"
                                                placeholder="Email nhận đơn hàng"
                                                name="email"
                                                value={user.email}
                                                onChange={handleShippingChange}
                                            />
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label htmlFor="input-address">ĐỊA CHỈ</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                id="input-address"
                                                placeholder="Nhập số nhà, tên đường"
                                                name="address"
                                                value={shippingInfo.address}
                                                onChange={handleShippingChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className={cx('wrapper')}>
                                    <div className={cx('title')}>
                                        <span className={cx('icon')}><FontAwesomeIcon icon={faCreditCard} /></span>
                                        <span>Phương thức thanh toán</span>
                                    </div>
                                    <div className={cx('inner')}>
                                        <div className={cx('payment-item')}>
                                            <img src={images.payment[0]} alt="cod"></img>
                                            <span>Thanh toán khi giao hàng (COD)</span>
                                        </div>
                                        <div className={cx('payment-item', 'disabled')}>
                                            <img src={images.payment[1]} alt="momo"></img>
                                            <span>Ví MoMo</span>
                                        </div>
                                        <div className={cx('payment-item', 'disabled')}>
                                            <img src={images.payment[2]} alt="zalo"></img>
                                            <span>Ví Zalopay bằng QRCode</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-5">
                        <div className="row g-2">
                            <div className="col-12">
                                <div className={cx('wrapper')}>
                                    <div className={cx('title')}>
                                        <span className={cx('icon')}><FontAwesomeIcon icon={faClipboardCheck} /></span>
                                        <span>Thông tin đơn hàng</span>
                                    </div>
                                    <div className={cx('inner')}>
                                        {listProducts.map((product, index) => {
                                            return (
                                                <div key={index} className={cx('product-item')} >
                                                    <img className={cx('product-image')} src={product.image} alt={product.name}></img>
                                                    <div className={cx('product-description')}>
                                                        <span className={cx('product-name')}> {product.name}</span>
                                                        <div>
                                                            <span className={cx('discounted-price')}>
                                                                <MoneyDisplay amount={product.price * (100 - product.discount) / 100} />
                                                            </span>
                                                            <span className={cx('original-price')}>
                                                                <MoneyDisplay amount={product.price} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={cx('product-quantity')}>
                                                        X
                                                        {product.quantity}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className={cx('wrapper')}>
                                    <div className={cx('checkout')}>
                                        <div className={cx('bill-total-cost')}>
                                            <div className={cx('order-detail')}>
                                                <span>Tiền hàng</span>
                                                <span className={cx('price')}>
                                                    <MoneyDisplay amount={totalPrice} />
                                                </span>
                                            </div>
                                            <div className={cx('order-detail')}>
                                                <span>Phí giao hàng</span>
                                                <span className={cx('price')}>
                                                    <MoneyDisplay amount={30000} />
                                                </span>
                                            </div>
                                        </div>
                                        <div className={cx('total-and-submit')}>
                                            <div className={cx('total-cost')}>
                                                <span>Tổng thanh toán</span>
                                                <span className={cx('total-price')}>
                                                    <MoneyDisplay amount={totalPrice + 30000} />
                                                </span>
                                            </div>
                                            <Button className={cx('button-submit')} onClick={handleSubmit} variant="contained" >Đặt mua</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkouts;