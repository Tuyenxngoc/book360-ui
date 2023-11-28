// React hooks
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
//Zoom images

// External libraries
import classNames from "classnames/bind";
import httpRequest from "~/utils/httpRequest";

// Styles
import Style from './BookDetails.module.scss';

// Components
import MoneyDisplay from "~/components/MoneyDisplay";
import Button from "~/components/Button";
import HomeProduct from "~/components/HomeProduct";
import Breadcrumbs from "~/components/Breadcrumb/Breadcrumb";
import Loading from "~/components/Loading";
import Error from "~/components/Error";

import { addProductToCart } from "~/services/apiRequest";
import useAuth from "~/hooks/useAuth";
import { toast } from "react-toastify";

const cx = classNames.bind(Style);

function BookDetails() {
    //Get user information
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    //Id book
    const { id } = useParams();
    //Data books
    const [data, setData] = useState({});
    //Loading book
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    //Quantity add cart
    const [quantity, setQuantity] = useState(1);
    // Xử lý logic với Id
    useEffect(() => {
        window.scrollTo(0, 0);
        httpRequest
            .get(`product/get-product-detail/${id}`)
            .then((response) => {
                setData(response.data.data)
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
                setIsError(true);
            });
    }, [id]);

    const calculateDiscountedPrice = () => {
        return data.discount > 0 ? data.price - (data.price * data.discount / 100) : data.price;
    };

    const currentPrice = calculateDiscountedPrice();

    const maxQuantity = data.quantity;
    const increaseQuantity = () => {
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        }
    };
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const handleQuantityChange = (event) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= maxQuantity) {
            setQuantity(newQuantity);
        }
    };
    const handleAddProductToCart = () => {
        if (isAuthenticated) {
            addProductToCart(user.customerId, id, quantity)
                .then(response => {
                    console.log(response.data);
                    toast.success('Thêm vào giỏ hàng thành công!', {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            navigate('/login', { replace: true, state: { from: location } });
        }
    }

    if (isError || isLoading) {
        return (
            <>
                {isLoading && <Loading />}
                {isError && <Error />}
            </>
        )
    }

    return (
        <>
            <Breadcrumbs currentPage={data.name}></Breadcrumbs>
            <div className='container'>
                <div className={cx('product')}>
                    <div className='row'>
                        <div className="col-5">
                            <div className={cx('product-img')}>
                                <div className="row">
                                    <div className="col-3">
                                        <div className={cx('prod-img')}>
                                            <img src={data.image} alt={data.name}></img>
                                        </div>
                                    </div>
                                    <div className="col">

                                        <div className={cx('sale-percentage-btn')}>{`-${data.discount}%`}</div>
                                        <div className={cx('prod-img')}>
                                            <img src={data.image} alt={data.name}></img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-7">
                            <div className={cx('product-content')}>
                                <div className={cx('pro-content-head')}>
                                    <h1>{data.name}</h1>
                                </div>

                                <div className={cx('pro-price')}>
                                    <div className={cx('current-price')}>
                                        <MoneyDisplay amount={currentPrice}></MoneyDisplay>
                                    </div>
                                    <div className={cx('original-price')}>
                                        <s><MoneyDisplay amount={data.price}></MoneyDisplay></s>
                                        <span className={cx('priceSaving')}>
                                            Bạn đã tiết kiệm được&nbsp;
                                            {<MoneyDisplay amount={data.price - currentPrice}></MoneyDisplay>}
                                        </span>
                                    </div>
                                </div>

                                <div className={cx('pro-short-desc')}>
                                    <ul>
                                        <li>{`Tác giả: ${data.author}`}</li>
                                        <li>{`Khuôn Khổ: ${data.size} cm`}</li>
                                    </ul>
                                </div>

                                <div className={cx('pro-rating')}>
                                    <div className={cx('pro-selled')}>
                                        {`Đã bán: ${data.selled}`}
                                    </div>
                                </div>


                                <div className={cx('product-quantity')}>
                                    <span>Chọn số lượng: </span>
                                    <div className={cx('qty-addcart')}>
                                        <button
                                            className={cx('btn', 'decrease')}
                                            onClick={decreaseQuantity}
                                        >-</button>
                                        <input
                                            value={quantity}
                                            onChange={handleQuantityChange}
                                            className={cx('input')}
                                            type="text" />
                                        <button
                                            className={cx('btn', 'increase')}
                                            onClick={increaseQuantity}
                                        >+</button>
                                    </div>
                                    <div className={cx('quantity')}>
                                        {data.quantity > 0 ? `Còn ${data.quantity} sản phẩm` : 'Tạm hết hàng'}
                                    </div>
                                </div>

                                {data.quantity !== 0 &&
                                    <div className="product-actions">
                                        <div className="row">
                                            <div className="col">
                                                <Button
                                                    onClick={handleAddProductToCart}
                                                    primary
                                                    large
                                                    id="AddToCart"
                                                    className="btnAddToCart"
                                                >Thêm vào giỏ hàng </Button>
                                            </div>
                                            <div className="col">
                                                <Button to={"/checkouts"} primary large id="buy-now" className="btn-light btnBuyNow ">Mua ngay</Button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-9">
                        <div className={cx('product-description-wrapper')}>
                            <h2 className={cx('tile')}>Mô tả sản phẩm</h2>
                            <div className={cx('description')}>
                                {data.description}
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className={cx('product-author-wrapper')}>
                            <h2 className={cx('tile')}>Sách cùng tác giả</h2>
                        </div>
                    </div>
                </div>
            </div>
            <HomeProduct title={'SÁCH MỚI'} url={'product/get-products?sortBy=createdDate'}></HomeProduct>
        </>
    )
}

export default BookDetails;