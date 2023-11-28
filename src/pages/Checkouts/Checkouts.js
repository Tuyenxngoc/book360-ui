import { Link, useLocation } from "react-router-dom";
import Breadcrumb from "~/components/Breadcrumb";
import useAuth from "~/hooks/useAuth";

import Style from './Checkouts.module.scss';
import classNames from "classnames/bind";
import MoneyDisplay from "~/components/MoneyDisplay";
import { Button } from "@mui/material";
import { axiosPrivate } from "~/utils/httpRequest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardCheck, faCreditCard, faUserPen } from "@fortawesome/free-solid-svg-icons";
import images from "~/assets/images";
import { useState } from "react";

const cx = classNames.bind(Style);

function Checkouts() {
    const { user } = useAuth();
    const location = useLocation();
    const listProducts = location.state?.listProducts || [];

    const [paymentMethods, setPaymentMethods] = useState();

    if (listProducts.length === 0) {
        return (
            <>
                <p>No products selected.</p>
                <Link to={'/'}>Home</Link>
            </>
        );
    }

    const handleSubmit = () => {
        axiosPrivate.post(`bill/order-from-cart/${user.customerId}`, {
            nameCustomer: user.username,
            phonenumber: "0984176224",
            address: "Thanh hoa",
            listProductId: []
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(err => {
                console.error(err);
            });
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
                                                defaultValue={user.username}
                                            />
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label htmlFor="input-phone-number">SỐ ĐIỆN THOẠI</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                id="input-phone-number"
                                                placeholder="Số điện thoại liên hệ khi giao hàng"
                                            />
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label htmlFor="input-email">EMAIL</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                id="input-email"
                                                placeholder="Email nhận đơn hàng"
                                                defaultValue={user.email}
                                            />
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label htmlFor="input-address">ĐỊA CHỈ</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                id="input-address"
                                                placeholder="Nhập số nhà, tên đường"
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
                                        {listProducts.map(product => {
                                            return (
                                                <div key={product.productId} className={cx('product-item')} >
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
                                                <span className={cx('price')}>4.000đ</span>
                                            </div>
                                            <div className={cx('order-detail')}>
                                                <span>Phí giao hàng</span>
                                                <span className={cx('price')}>30.000đ</span>
                                            </div>
                                        </div>
                                        <div className={cx('total-and-submit')}>
                                            <div className={cx('total-cost')}>
                                                <span>Tổng thanh toán</span>
                                                <span className={cx('total-price')}>30.000đ</span>
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