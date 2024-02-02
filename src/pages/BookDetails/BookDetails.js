// React hooks
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

// External libraries
import httpRequest from '~/utils/httpRequest';

// Styles
import Style from './BookDetails.module.scss';
import classNames from 'classnames/bind';

// Components
import MoneyDisplay from '~/components/MoneyDisplay';
import HomeProduct from '~/components/HomeProduct';
import Breadcrumbs from '~/components/Breadcrumb/Breadcrumb';

import { addProductToCart } from '~/services/apiRequest';
import useAuth from '~/hooks/useAuth';
import { toast } from 'react-toastify';
import Product from '~/components/Product';
import useCart from '~/hooks/useCart';
import { addFavoriteProduct, checkFavoriteProduct, removeFavoriteProduct } from '~/services/customerService';
import images from '~/assets';
import { Button, CircularProgress, Skeleton } from '@mui/material';
import Slider from 'react-slick';
import CustomArrows from '~/components/CustomArrows';
import { getProductDetails, getProductSameAuthor } from '~/services/productService';

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

const calculateDiscountedPrice = (price, discount) => {
    return discount > 0 ? price - (price * discount / 100) : price;
};

function BookDetails() {
    const { id } = useParams();

    const { updateTotalProducts } = useCart();
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [navSlider, setNavSlider] = useState(null);
    const [mainSlider, setMainSlider] = useState(null);

    const [bookData, setBookData] = useState(null);
    const [sameAuthorBookData, setSameAuthorBookData] = useState([]);

    const [isSend, setIsSend] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                window.scrollTo(0, 0);

                const [productDetailResponse, sameAuthorBooksResponse] = await Promise.all([
                    getProductDetails(id),
                    getProductSameAuthor(id, 'pageSize=5')
                ]);

                setBookData(productDetailResponse.data.data);
                setSameAuthorBookData(sameAuthorBooksResponse.data.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (isAuthenticated && bookData) {
            const fetchData = async () => {
                try {
                    const response = await checkFavoriteProduct(bookData.productId);
                    setIsFavorite(response.data.data);
                } catch (error) {
                    console.error('Error checking favorite status:', error);
                }
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, bookData]);

    const handleToggleFavorite = async () => {
        if (isAuthenticated) {
            setIsSend(true);
            try {
                if (isFavorite) {
                    await removeFavoriteProduct(bookData.productId);
                    setIsFavorite(false);
                } else {
                    await addFavoriteProduct(bookData.productId);
                    setIsFavorite(true);
                }
            } catch (error) {
                console.error('Error toggling favorite status:', error);
            } finally {
                setIsSend(false);
            }

        } else {
            navigate('/login', { replace: true, state: { from: location } });
        }
    };

    const handleAddProductToCart = () => {
        if (isAuthenticated) {
            addProductToCart(id, quantity)
                .then((response) => {
                    updateTotalProducts();
                    toast.success('Thêm vào giỏ hàng thành công');
                })
                .catch((error) => {
                    toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
                });
        } else {
            navigate('/login', { replace: true, state: { from: location } });
        }
    }

    const handleBuyNow = () => {
        if (isAuthenticated) {
            addProductToCart(id, quantity)
                .then((response) => {
                    navigate('/cart', { state: { productIdSelect: [bookData.productId] } });
                })
                .catch((error) => {
                    toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
                });

        } else {
            navigate('/login', { replace: true, state: { from: location } });
        }
    }

    const currentPrice = useMemo(() => {
        if (bookData) {
            return calculateDiscountedPrice(bookData.price, bookData.discount);
        }
        return 0;
    }, [bookData]);

    const maxQuantity = 10;

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

    return (
        <>
            {bookData ? (
                <>
                    <Breadcrumbs
                        breadcrumbs={[
                            {
                                label: bookData.category.name,
                                url: `/category/${bookData.category.id}`,
                            },
                        ]}
                        currentPage={bookData.name}
                    />
                    <div className='container'>
                        <main className={cx('product')}>
                            <div className='row'>
                                <div className='col-5'>
                                    <div className={cx('product-img')}>
                                        <div className='row'>
                                            <div className='col-3'>
                                                <div className={cx('image')}>
                                                    {bookData.images.length > 1 ? (
                                                        <Slider {...settingsNav} slidesToShow={Math.min(3, bookData.images.length - 1)} asNavFor={mainSlider} ref={(slider) => setNavSlider(slider)}>
                                                            {bookData.images.map((image, index) => (
                                                                <img key={index} src={image.url} alt={bookData.name} />
                                                            ))}
                                                        </Slider>
                                                    ) : (
                                                        <img src={bookData.images[0]?.url} alt={bookData.name} />
                                                    )}
                                                </div>
                                            </div>
                                            <div className='col-9'>
                                                <div className={cx('image')}>
                                                    {bookData.discount > 0 && <div className={cx('sale-percentage-btn')}>{`-${bookData.discount}%`}</div>}
                                                    {bookData.images.length > 1 ? (
                                                        <Slider {...settingsMain} asNavFor={navSlider} ref={(slider) => setMainSlider(slider)}>
                                                            {bookData.images.map((image, index) => (
                                                                <img key={index} src={image.url} alt={bookData.name} />
                                                            ))}
                                                        </Slider>
                                                    ) : (
                                                        <img src={bookData.images[0]?.url} alt={bookData.name} />
                                                    )}
                                                    <div className={cx('interaction')}>
                                                        <div className={cx('interaction-item')} style={{ marginRight: 8 }}>
                                                            <img className={cx('interaction-img')} src={images.share} alt='share' />
                                                        </div>
                                                        <div className={cx('interaction-item')}>
                                                            {isSend ? (
                                                                <CircularProgress size={15} color='inherit' />
                                                            ) : (
                                                                isFavorite
                                                                    ? <img className={cx('interaction-img')} onClick={handleToggleFavorite} src={images.like} alt='like' />
                                                                    : <img className={cx('interaction-img')} onClick={handleToggleFavorite} src={images.unLike} alt='unlike' />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-7'>
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
                                                <li>{`ISBN: ${bookData.isbn}`}</li>
                                                <li>Tác giả:
                                                    {bookData.authors.map((author, index) => {
                                                        return <Link key={index} to={`/author/${author.id}`}>{author.fullName}</Link>
                                                    })}
                                                </li>
                                                <li>Đối tượng: </li>
                                                <li>Khuôn Khổ: {bookData.size}</li>
                                                <li>Số trang: {bookData.pageCount}</li>
                                                <li>Định dạng: {bookData.format}</li>
                                                <li>Trọng lượng: {bookData.weight} gram</li>
                                            </ul>
                                        </div>

                                        <div className={cx('pro-rating')}>
                                            <div className={cx('pro-selled')}>
                                                {`Đã bán: ${bookData.soldQuantity}`}
                                            </div>
                                        </div>

                                        <div className={cx('product-quantity')}>
                                            <span>Chọn số lượng: </span>
                                            <div className={cx('qty-addcart')}>
                                                <button
                                                    className={cx('btn', 'decrease')}
                                                    onClick={decreaseQuantity}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    value={quantity}
                                                    onChange={handleQuantityChange}
                                                    className={cx('input')}
                                                    type='text' />
                                                <button
                                                    className={cx('btn', 'increase')}
                                                    onClick={increaseQuantity}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className={cx('quantity')}>
                                                {bookData.stockQuantity > 0 ? `Còn ${bookData.stockQuantity} sản phẩm` : 'Tạm hết hàng'}
                                            </div>
                                        </div>

                                        {bookData.stockQuantity !== 0 &&
                                            <div className='product-actions'>
                                                <div className='row'>
                                                    <div className='col'>
                                                        <Button
                                                            variant='contained'
                                                            fullWidth
                                                            onClick={handleAddProductToCart}
                                                        >
                                                            Thêm vào giỏ hàng
                                                        </Button>
                                                    </div>
                                                    <div className='col'>
                                                        <Button
                                                            variant='contained'
                                                            fullWidth
                                                            onClick={handleBuyNow}
                                                        >
                                                            Mua ngay
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>

                    <div className='container'>
                        <div className='row'>
                            <div className='col-8'>
                                <div className={cx('product-description-wrapper')}>
                                    <h2 className={cx('tile')}>Mô tả sản phẩm</h2>
                                    <div
                                        className={cx('description')}
                                        dangerouslySetInnerHTML={{ __html: bookData.description }}>
                                    </div>
                                </div>
                            </div>
                            {sameAuthorBookData.length > 0 &&
                                <div className='col-4'>
                                    <div className={cx('product-author-wrapper')}>
                                        <h2 className={cx('tile')}>Sách cùng tác giả</h2>
                                        <div className='row'>
                                            {sameAuthorBookData.map((data, index) => (
                                                <div key={index} className='col'>
                                                    <Product data={data} small ></Product>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <Breadcrumbs currentPage={null} />
                    <div className='container'>
                        <main className={cx('product')}>
                            <div className='row'>
                                <div className='col-5'>
                                    <div className={cx('product-img')}>
                                        <div className='row'>
                                            <div className='col-3'>
                                                {Array.from({ length: 3 }).map((_, index) => (
                                                    <div key={index} className='mb-1'>
                                                        <Skeleton animation="wave" variant="rectangular" width='100%' height={120} />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='col-9'>
                                                {<Skeleton animation="wave" variant="rectangular" width='100%' height={450} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-7'>
                                    <div className={cx('product-content')}>
                                        <div className={cx('pro-content-head')}>
                                            <Skeleton animation="wave" variant="rectangular" width='100%' height={40} />
                                        </div>
                                        <div className={cx('pro-price')}>
                                            <div className={cx('current-price')}>
                                                <Skeleton animation="wave" variant="rectangular" width='30%' height={20} />
                                            </div>
                                            <div className={cx('original-price')}>
                                                <Skeleton animation="wave" variant="rectangular" width='50%' height={20} />
                                            </div>
                                        </div>
                                        <div className={cx('pro-short-desc')}>
                                            <Skeleton className='mb-1' animation="wave" variant="rectangular" width='40%' height={20} />
                                            <Skeleton className='mb-1' animation="wave" variant="rectangular" width='40%' height={20} />
                                        </div>
                                        <div className={cx('pro-rating')}>
                                            <Skeleton animation="wave" variant="rectangular" width='20%' height={20} />
                                        </div>
                                        <div className={cx('product-quantity')}>
                                            <Skeleton animation="wave" variant="rectangular" width='60%' height={40} />
                                        </div>
                                        <div className='product-actions'>
                                            <div className='row'>
                                                <div className='col'>
                                                    <Skeleton animation="wave" variant="rounded" width='100%' height={40} />
                                                </div>
                                                <div className='col'>
                                                    <Skeleton animation="wave" variant="rounded" width='100%' height={40} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-8'>
                                <div className={cx('product-description-wrapper')}>
                                    <h2 className={cx('tile')}>
                                        <Skeleton animation="wave" variant="rounded" width='20%' height={30} />
                                    </h2>
                                    <div className={cx('description')}>
                                        {Array.from({ length: 8 }).map((_, index) => (
                                            <div key={index} className='mb-2'>
                                                <Skeleton animation="wave" variant="rounded" width='100%' height={18} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='col-4'>
                                <div className={cx('product-author-wrapper')}>
                                    <h2 className={cx('tile')}>
                                        <Skeleton animation="wave" variant="rounded" width='40%' height={30} />
                                    </h2>
                                    <div className='row gy-2'>
                                        {Array.from({ length: 2 }).map((_, index) => (
                                            <div key={index} className='col-12' style={{ display: 'flex', alignItems: 'center' }}>
                                                <Skeleton animation="wave" variant="rounded" width={80} height={100} />
                                                <div style={{ width: '100%', marginLeft: '5px' }}>
                                                    <Skeleton className='mb-1' animation="wave" variant="rounded" width='100%' height={20} />
                                                    <Skeleton className='mb-1' animation="wave" variant="rounded" width='70%' height={20} />
                                                    <Skeleton className='mb-1' animation="wave" variant="rounded" width='50%' height={20} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
            }
            <HomeProduct title={'SÁCH MỚI'} apiUrl={'product/get-products?sortBy=createdDate'} moreLink={'/search'}></HomeProduct>
        </>
    )
}

export default BookDetails;