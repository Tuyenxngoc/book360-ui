// React hooks
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
//Zoom images

// External libraries
import httpRequest from "~/utils/httpRequest";

// Styles
import Style from './BookDetails.module.scss';
import classNames from "classnames/bind";

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
import { addFavoriteProduct, checkFavoriteProduct, removeFavoriteProduct } from "~/services/customerService";
import images from "~/assets";
import { CircularProgress } from "@mui/material";
import Slider from "react-slick";
import CustomArrows from "~/components/CustomArrows";

const cx = classNames.bind(Style);

const settingsNav = {
    accessibility: true,
    dots: false,
    infinite: false,
    swipeToSlide: true,
    focusOnSelect: true,
    speed: 200,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    nextArrow: <CustomArrows isVertical color='red' isNextArrow />,
    prevArrow: <CustomArrows isVertical color='red' />,
};

const settingsMain = {
    dots: false,
    infinite: false,
    swipeToSlide: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
};

function BookDetails() {
    //Get user information
    const { customer, isAuthenticated } = useAuth();
    const { updateTotalProducts } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    //Slide
    const [mainSlider, setMainSlider] = useState(null);
    const [navSlider, setNavSlider] = useState(null);
    //Id book
    const { id } = useParams();
    //Data books
    const [bookData, setBookData] = useState({});
    //Same author
    const [sameAuthorBookData, setSameAuthorBookData] = useState([]);
    //Loading book
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSend, setIsSend] = useState(false);
    //Quantity add cart
    const [quantity, setQuantity] = useState(1);
    //Favorite product
    const [isFavorite, setIsFavorite] = useState(false);

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

    useEffect(() => {
        if (isAuthenticated && bookData.productId) {
            const fetchData = async () => {
                try {
                    const response = await checkFavoriteProduct(customer.customerId, bookData.productId);
                    setIsFavorite(response.data.data);
                } catch (error) {
                    console.error('Error checking favorite status:', error);
                }
            };

            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, bookData.productId]);

    const handleToggleFavorite = async () => {
        setIsSend(true);
        try {
            if (isFavorite) {
                await removeFavoriteProduct(customer.customerId, bookData.productId);
                setIsFavorite(false);
            } else {
                await addFavoriteProduct(customer.customerId, bookData.productId);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Error toggling favorite status:', error);
        } finally {
            setIsSend(false);
        }
    };

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

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <Error />;
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
                                        <div className={cx('image')}>
                                            {bookData.images.length > 1 ? (
                                                <Slider {...settingsNav} slidesToShow={Math.min(3, bookData.images.length - 1)} asNavFor={mainSlider} ref={(slider) => setNavSlider(slider)}>
                                                    {bookData.images.map((image, index) => (
                                                        <img key={index} src={image.url} alt={bookData.name} />
                                                    ))}
                                                </Slider>
                                            ) : (
                                                <img src={bookData.images[0].url} alt={bookData.name} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-9">
                                        <div className={cx('image')}>
                                            <div className={cx('sale-percentage-btn')}>{`-${bookData.discount}%`}</div>
                                            {bookData.images.length > 1 ? (
                                                <Slider {...settingsMain} asNavFor={navSlider} ref={(slider) => setMainSlider(slider)}>
                                                    {bookData.images.map((image, index) => (
                                                        <img key={index} src={image.url} alt={bookData.name} />
                                                    ))}
                                                </Slider>
                                            ) : (
                                                <img src={bookData.images[0].url} alt={bookData.name} />
                                            )}
                                            {!isLoading && (
                                                <div className={cx('interaction')}>
                                                    <div className={cx('interaction-item')} style={{ marginRight: 8 }}>
                                                        <img className={cx('interaction-img')} src={images.share} alt="share" />
                                                    </div>
                                                    <div className={cx('interaction-item')}>
                                                        {isSend ? (
                                                            <CircularProgress size={15} color="inherit" />
                                                        ) : (
                                                            isFavorite
                                                                ? <img className={cx('interaction-img')} onClick={handleToggleFavorite} src={images.like} alt="like" />
                                                                : <img className={cx('interaction-img')} onClick={handleToggleFavorite} src={images.unLike} alt="unlike" />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
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