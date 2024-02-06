import { useState, useEffect } from "react";

import Breadcrumb from "~/components/Breadcrumb";

import { Button, Checkbox } from "@mui/material";
import CartItem from "~/components/CartItem";

import Style from './Cart.module.scss';
import classNames from "classnames/bind";
import { useLocation, useNavigate } from "react-router-dom";
import MoneyDisplay from "~/components/MoneyDisplay";
import { toast } from "react-toastify";
import useCart from "~/hooks/useCart";
import { deleteProductFromCart, getProductsFromCart, updateCartDetail } from "~/services/cartService";

const cx = classNames.bind(Style);

function Cart() {
    const location = useLocation();
    const productIdSelect = location.state?.productIdSelect || [];

    const { updateTotalProducts } = useCart();
    const [cartItems, setCartItems] = useState([]);
    const [checked, setChecked] = useState(productIdSelect);
    const [totalPrice, setTotalPrice] = useState(0);

    const navigate = useNavigate();

    const fetchCartItems = async () => {
        try {
            const response = await getProductsFromCart()
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

    const handleUpdateQuantity = (productId, newQuantity, setIsUpdate, setQuantity) => {
        setIsUpdate(true);
        updateCartDetail(productId, newQuantity)
            .then((response) => {
                const newCartItems = cartItems.map((item) =>
                    item.productId === productId ? { ...item, quantity: newQuantity } : item
                );
                setCartItems(newCartItems);
                setQuantity(newQuantity);
                updateTotalProducts();
            })
            .catch((error) => {
            })
            .finally(() => {
                setIsUpdate(false);
            });
    };

    const handleDeleteProduct = (productId) => {
        deleteProductFromCart(productId)
            .then((response) => {
                updateTotalProducts();
                setCartItems(cartItems.filter(item => item.productId !== productId))
            })
            .catch((error) => {
                toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
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
            toast.info("Vui lòng chọn sản phẩm để thanh toán")
            return;
        }
        const outputArray = checked.map((productId) => {
            const productInfo = cartItems.find((product) => product.productId === productId);
            if (productInfo) {
                return {
                    ...productInfo
                };
            }
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
                                    <div className={cx('no-product')}>
                                        <p>Giỏ hàng của bạn còn trống</p>
                                        <Button variant="contained" onClick={() => navigate('/')}>Mua ngay</Button>
                                    </div>
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