import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
// Style
import style from './Product.module.scss'
import classNames from "classnames/bind";
import MoneyDisplay from "../MoneyDisplay";
import { Skeleton } from "@mui/material";

const cx = classNames.bind(style)

function Product({ data, small = false }) {

    return (
        <div className={cx('product-item', { small })}>
            <div className={cx('product-img')}>
                {data ? (
                    <>
                        <Link to={`/product/${data.productID}`}>
                            <img src={data.image} alt={data.name} />
                        </Link>
                        <div className={cx('product-tags')}>
                            {data.discount > 0 && <div className={cx('tag-sale-off')}>-{data.discount}%</div>}
                            {data.quantity === 0 && <div className={cx('tag-sold-out')}>Hết hàng</div>}
                        </div>
                    </>
                ) : (
                    <Skeleton variant="rectangular" fitContent height={250} />
                )}
            </div>

            <div className={cx('product-info')}>
                {data ? (
                    <>
                        <div className={cx('product-title')}>
                            <Link to={`/product/${data.productID}`}>{data.name}</Link>
                        </div>

                        <div className={cx('product-price')}>
                            <span className={cx('current-price')}>
                                <MoneyDisplay amount={data.price} discountPercent={data.discount}></MoneyDisplay>
                            </span>

                            {data.discount > 0 && (
                                <span className={cx('original-price')}>
                                    <s><MoneyDisplay amount={data.price}></MoneyDisplay></s>
                                </span>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Skeleton />
                        <Skeleton width="60%" />
                    </>
                )}

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
    }),
    small: PropTypes.bool
};

export default Product;