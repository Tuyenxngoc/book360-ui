import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
// Style
import style from './Product.module.scss'
import classNames from "classnames/bind";
import MoneyDisplay from "../MoneyDisplay";

const cx = classNames.bind(style)

function Product({ data }) {
    const calculateDiscountedPrice = () => {
        return data.discount > 0 ? data.price - (data.price * data.discount / 100) : data.price;
    };
    const currentPrice = calculateDiscountedPrice();

    return (
        <div className={cx('product-item')}>
            <div className={cx('product-img')}>
                <Link to={`/product/${data.productID}`}>
                    <img src={data.image} alt={data.name} />
                </Link>

                <div className={cx('product-tags')}>
                    {data.discount > 0 && <div className={cx('tag-saleoff')}>-{data.discount}%</div>}
                    {data.quantity === 0 && <div className={cx('tag-soldout')}>Hết hàng</div>}
                </div>
            </div>

            <div className={cx('product-info')}>
                <div className={cx('product-title')}>
                    <Link to={`/product/${data.productID}`}>{data.name}</Link>
                </div>

                <div className={cx('product-price')}>
                    <span className={cx('current-price')}>
                        <MoneyDisplay amount={currentPrice}></MoneyDisplay>
                    </span>
                    <span className={cx('original-price')}>
                        <s><MoneyDisplay amount={data.price}></MoneyDisplay></s>
                    </span>
                </div>
            </div>
        </div>
    );
}

Product.propTypes = {
    data: PropTypes.shape({
        productID: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        discount: PropTypes.number.isRequired,
    }).isRequired,
};

export default Product;