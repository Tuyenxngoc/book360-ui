// React hooks
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

// External libraries
import classNames from "classnames/bind";
import request from "~/utils/request";

// Styles
import Style from './BookDetails.module.scss';

// Components
import MoneyDisplay from "~/components/MoneyDisplay";
import Button from "~/components/Button";
import HomeProduct from "~/components/HomeProduct";
import Breadcrumbs from "~/components/Breadcrumb/Breadcrumb";

const cx = classNames.bind(Style);

function BookDetails() {
    const { id } = useParams();
    const [data, setData] = useState({});

    // Xử lý logic với Id
    useEffect(() => {
        //Lên đầu trang
        window.scrollTo(0, 0);
        request
            .get(`product/get-product-detail/${id}`)
            .then((response) => { setData(response.data.data) })
            .catch((error) => { console.log(error.response.data.message); });
    }, [id]);

    const calculateDiscountedPrice = () => {
        return data.discount > 0 ? data.price - (data.price * data.discount / 100) : data.price;
    };
    const currentPrice = calculateDiscountedPrice();

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
                                        <button className={cx('btn', 'decrease')}>-</button>
                                        <input className={cx('input')} type="text" defaultValue={1} />
                                        <button className={cx('btn', 'increase')}>+</button>
                                    </div>
                                    <div className={cx('quantity')} >{`Còn ${data.quantity} sản phẩm`}</div>
                                </div>

                                <div className="product-actions">
                                    <div className="row">
                                        <div className="col">
                                            <Button primary large id="AddToCart" className="btnAddToCart">Thêm vào giỏ hàng </Button>
                                        </div>
                                        <div className="col">
                                            <Button primary large id="buy-now" className="btn-light btnBuyNow ">Mua ngay</Button>
                                        </div>
                                    </div>
                                </div>
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