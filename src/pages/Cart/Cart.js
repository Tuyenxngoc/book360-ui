import { useState, useEffect } from "react";
import { axiosPrivate } from "~/utils/httpRequest";

import Breadcrumb from "~/components/Breadcrumb";
import useAuth from "~/hooks/useAuth";

import { Button, Checkbox } from "@mui/material";
import CartItem from "~/components/CartItem";

import { removeCartItems, updatedCartItems } from "~/services/apiRequest";

import Style from './Cart.module.scss';
import classNames from "classnames/bind";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MoneyDisplay from "~/components/MoneyDisplay";
import { toast } from "react-toastify";

const cx = classNames.bind(Style);

function Cart() {
    const location = useLocation();
    const productIdSelect = location.state?.productIdSelect || [];

    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [checked, setChecked] = useState(productIdSelect);
    const [totalPrice, setTotalPrice] = useState(0);

    const navigate = useNavigate();

    const fetchCartItems = async () => {
        try {
            const response = await axiosPrivate.get(`/cart/get-cart-infor/${user.customerId}`);
            setCartItems(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCartItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // Calculate total price when cartItems or checked array changes
        const totalPrice = cartItems.reduce((sum, product) => {
            if (checked.includes(product.productId)) {
                return sum + product.quantity * (product.price * (100 - product.discount) / 100); // Assuming each product has a 'price' property
            }
            return sum;
        }, 0);
        setTotalPrice(totalPrice);
    }, [cartItems, checked]);

    const handleUpdateQuantity = (productId, newQuantity, setIsUpdate) => {
        setIsUpdate(true);
        updatedCartItems(user.customerId, productId, newQuantity)
            .then(response => {
                console.log(response.data);
                const newCartItems = cartItems.map((item) =>
                    item.productId === productId ? { ...item, quantity: newQuantity } : item
                );
                setCartItems(newCartItems);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setIsUpdate(false);
            });
    };

    const handleDeleteProduct = (productId) => {
        removeCartItems(user.customerId, productId)
            .then((response) => {
                console.log(response);
                setCartItems(cartItems.filter(item => item.productId !== productId))
            })
            .catch((error) => {
                console.log(error);
            });
    };

    function handleCheckedChange(id) {
        const isChecked = checked.includes(id);
        if (isChecked) {
            setChecked(checked.filter(item => item !== id));
        } else {
            setChecked([...checked, id]);
        }
    }

    function handleToggleAllCheckboxes(e) {
        if (e.target.checked) {
            setChecked(cartItems.map(item => item.productId))
        } else {
            setChecked([]);
        }
    }

    function handleSubmit() {
        if (checked.length === 0) {
            toast.warn("Vui lòng chọn sản phẩm để thanh toán")
            return;
        }
        const outputArray = checked.map((productId) => {
            const productInfo = cartItems.find((product) => product.productId === productId);

            if (productInfo) {
                return {
                    ...productInfo
                };
            }

            // Trường hợp nếu không tìm thấy thông tin sản phẩm
            return null;
        });
        navigate('/checkouts', { state: { listProducts: outputArray } });
    }

    return (
        <>
            <Breadcrumb currentPage="Giỏ hàng của bạn"></Breadcrumb>
            <main>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            {cartItems.length === 0
                                ? (
                                    <>
                                        <p>Giỏ hàng của bạn còn trống</p>
                                        <Link to='/'>Mua ngay</Link>
                                    </>
                                )
                                : (
                                    <>
                                        <table className={cx('cart-table')}>
                                            <thead>
                                                <tr>
                                                    <th className={cx('header-cell')}>
                                                        <Checkbox checked={checked.length === cartItems.length} onChange={handleToggleAllCheckboxes} />
                                                    </th>
                                                    <th colSpan={2} className={cx('header-cell')}>Sản phẩm</th>
                                                    <th className={cx('header-cell')}>Đơn giá</th>
                                                    <th className={cx('header-cell')}>Số lượng</th>
                                                    <th className={cx('header-cell')}>Số tiền</th>
                                                    <th className={cx('header-cell')}>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map((product, index) => {
                                                    return (
                                                        <CartItem
                                                            key={index}
                                                            data={product}
                                                            onUpdateQuantity={handleUpdateQuantity}
                                                            onDeleteProduct={handleDeleteProduct}
                                                            checked={checked.includes(product.productId)}
                                                            onChecked={handleCheckedChange}
                                                        >
                                                        </CartItem>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        <div className={cx('checkout')}>
                                            <div className={cx('checkout-desciption')}>
                                                <span className={cx('quantity-product')}> Tổng thanh toán ({checked.length} Sản phẩm):</span>
                                                <span className={cx('total-price')}><MoneyDisplay amount={totalPrice} /></span>
                                            </div>
                                            <Button onClick={handleSubmit} variant="contained">Mua ngay</Button>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Cart;