import PropTypes from 'prop-types';

import { Checkbox } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";

import MoneyDisplay from "~/components/MoneyDisplay";

import Style from './CartItem.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

function CartItem({ data: product, onUpdateQuantity, onDeleteProduct, checked, onChecked }) {

    const [quantity, setQuantity] = useState(product.quantity);
    const [isUpdate, setIsUpdate] = useState(false);

    const handleIncrement = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onUpdateQuantity(product.productId, newQuantity, setIsUpdate);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onUpdateQuantity(product.productId, newQuantity, setIsUpdate);
        }
    };

    const handleCheckedChange = () => {
        onChecked(product.productId);
    }

    const handleRemoveItem = () => {
        onDeleteProduct(product.productId);
    }

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const calculateDiscountedPrice = () => {
        return product.discount > 0
            ? product.price - (product.price * product.discount / 100)
            : product.price;
    };

    const currentPrice = calculateDiscountedPrice();

    return (
        <tr className={cx('cart-item')}>
            {/* CheckBox */}
            <td className={cx('checkbox-cell')}>
                <Checkbox checked={checked} onChange={handleCheckedChange} />
            </td>
            {/* Image */}
            <td className={cx('image-cell')}>
                <Link className={cx('product-link')} to={`/product/${product.productId}`}                >
                    <img className={cx('product-image')} src={product.image} alt={product.name} />
                </Link>
            </td>
            {/* Name */}
            <td className={cx('name-cell')}>
                <Link className={cx('product-name')} to={`/product/${product.productId}`}>{product.name}</Link>
                {product.discount > 0 && <div className={cx('product-discount')}>Khuyến mãi: Giảm {product.discount}%</div>}
            </td>
            {/* Price */}
            <td className={cx('price-cell')}>
                {product.discount > 0 && <span className={cx('original-price')}><MoneyDisplay amount={product.price} /></span>}
                <span className={cx('discounted-price')}><MoneyDisplay amount={currentPrice} /></span>
            </td>
            {/* Control */}
            <td className={cx('quantity-control-cell')}>
                <div className={cx('quantity-control')}>
                    <button className={cx('quantity-button')} onClick={handleDecrement} disabled={isUpdate}>-</button>
                    <input
                        className={cx('quantity-input')}
                        type="text"
                        value={quantity}
                        disabled={isUpdate}
                        onChange={handleQuantityChange}
                    />
                    <button className={cx('quantity-button')} onClick={handleIncrement} disabled={isUpdate}>+</button>
                </div>
            </td>
            {/* Total price */}
            <td className={cx('total-price-cell')}>
                <span className={cx('product-price')}><MoneyDisplay amount={quantity * currentPrice} /></span>
            </td>
            {/* Remove */}
            <td className={cx('remove-cell')}>
                <button className={cx('delete-button')} onClick={handleRemoveItem}>Xóa</button>
            </td>
        </tr>
    );
}

CartItem.propTypes = {
    data: PropTypes.shape({
        productId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
    }).isRequired,
};

export default CartItem;