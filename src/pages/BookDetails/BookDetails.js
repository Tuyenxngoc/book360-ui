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
import Product from "~/components/Product";
import useCart from "~/hooks/useCart";

const cx = classNames.bind(Style);

function BookDetails() {
    //Get user information
    const { customer, isAuthenticated } = useAuth();
    const { updateTotalProducts } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    //Id book
    const { id } = useParams();
    //Data books
    const [bookData, setBookData] = useState({});
    //Same author
    const [sameAuthorBookData, setSameAuthorBookData] = useState([]);
    //Loading book
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    //Quantity add cart
    const [quantity, setQuantity] = useState(1);
    // Xử lý logic với Id
    useEffect(() => {
        const fetchData = async () => {
            try {
                window.scrollTo(0, 0);

                const [productDetailResponse, sameAuthorBooksResponse] = await Promise.all([
                    httpRequest.get(`product/get-product-detail/${id}`),
                    httpRequest.get(`product/get-products-same-author/${id}`)
                ]);

                setBookData(productDetailResponse.data.data);
                setSameAuthorBookData(sameAuthorBooksResponse.data.data);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setIsError(true);
            }
        };

        fetchData();
    }, [id]);

    const calculateDiscountedPrice = () => {
        return bookData.discount > 0 ? bookData.price - (bookData.price * bookData.discount / 100) : bookData.price;
    };

    const currentPrice = calculateDiscountedPrice();

    const maxQuantity = bookData.quantity;
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
            addProductToCart(customer.customerId, id, quantity)
                .then(response => {
                    updateTotalProducts(customer.customerId);
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

    const handleBuyNow = () => {
        if (isAuthenticated) {
            addProductToCart(customer.customerId, id, quantity)
                .then(response => {
                    navigate('/cart', { state: { productIdSelect: [bookData.productId] } });
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
            <Breadcrumbs currentPage={bookData.name}></Breadcrumbs>
            <div className='container'>
                <main className={cx('product')}>
                    <div className='row'>
                        <div className="col-5">
                            <div className={cx('product-img')}>
                                <div className="row">
                                    <div className="col-3">
                                        <div className={cx('prod-img')}>
                                            <img src={bookData.image} alt={bookData.name}></img>
                                        </div>
                                    </div>
                                    <div className="col">

                                        <div className={cx('sale-percentage-btn')}>{`-${bookData.discount}%`}</div>
                                        <div className={cx('prod-img')}>
                                            <img src={bookData.image} alt={bookData.name}></img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-7">
                            <div className={cx('product-content')}>
                                <div className={cx('pro-content-head')}>
                                    <h1>{bookData.name}</h1>
                                </div>

                                <div className={cx('pro-price')}>
                                    <div className={cx('current-price')}>
                                        <MoneyDisplay amount={currentPrice}></MoneyDisplay>
                                    </div>
                                    <div className={cx('original-price')}>
                                        <s><MoneyDisplay amount={bookData.price}></MoneyDisplay></s>
                                        <span className={cx('priceSaving')}>
                                            Bạn đã tiết kiệm được&nbsp;
                                            {<MoneyDisplay amount={bookData.price - currentPrice}></MoneyDisplay>}
                                        </span>
                                    </div>
                                </div>

                                <div className={cx('pro-short-desc')}>
                                    <ul>
                                        <li>{`Tác giả: ${bookData.author}`}</li>
                                        <li>{`Khuôn Khổ: ${bookData.size} cm`}</li>
                                    </ul>
                                </div>

                                <div className={cx('pro-rating')}>
                                    <div className={cx('pro-selled')}>
                                        {`Đã bán: ${bookData.selled}`}
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
                                        {bookData.quantity > 0 ? `Còn ${bookData.quantity} sản phẩm` : 'Tạm hết hàng'}
                                    </div>
                                </div>

                                {bookData.quantity !== 0 &&
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
                                                <Button onClick={handleBuyNow} primary large id="buy-now" className="btn-light btnBuyNow ">Mua ngay</Button>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-8">
                        <div className={cx('product-description-wrapper')}>
                            <h2 className={cx('tile')}>Mô tả sản phẩm</h2>
                            <div
                                className={cx('description')}
                                dangerouslySetInnerHTML={{ __html: bookData.description }}>
                            </div>
                        </div>
                    </div>
                    {sameAuthorBookData.length > 0 &&
                        <div className="col-4">
                            <div className={cx('product-author-wrapper')}>
                                <h2 className={cx('tile')}>Sách cùng tác giả</h2>
                                <div className="row">
                                    {sameAuthorBookData.map((data, index) => (
                                        <div key={index} className="col">
                                            <Product data={data} small ></Product>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <HomeProduct title={'SÁCH MỚI'} apiUrl={'product/get-products?sortBy=createdDate'} moreLink={'/search'}></HomeProduct>
        </>
    )
}

export default BookDetails;