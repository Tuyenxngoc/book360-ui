import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//Component
import httpRequest from '~/utils/httpRequest';
import Product from '~/components/Product/Product';
//Slider
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
//Style
import Style from './HomeProduct.module.scss'
import classNames from 'classnames/bind';
//Icon
import { Skeleton, Typography } from '@mui/material';
import CustomArrows from '../CustomArrows';

const cx = classNames.bind(Style);

const settings = {
    infinite: true,
    draggable: false,
    speed: 800,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <CustomArrows color='secondary' isNextArrow />,
    prevArrow: <CustomArrows color='secondary' />,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

function HomeProduct({ title, showBanner, apiUrl, moreLink }) {

    const [productData, setProductData] = useState();

    useEffect(() => {
        httpRequest
            .get(apiUrl)
            .then((response) => setProductData(response.data.data.items))
            .catch((error) => console.error(error));
    }, [apiUrl]);

    return (
        <div className='home-product'>
            {showBanner &&
                <div className={cx('banner-home-pro')}>
                    <Link className={cx('banner-home-pro-link')} to={moreLink}>
                        {productData ? (
                            productData[0] && productData[0].category && productData[0].category.image ? (
                                <img src={productData[0].category.image} alt='home-banner' />
                            ) : (
                                <></>
                            )
                        ) : (
                            <Skeleton animation='wave' variant='rectangular' height={120} />
                        )}
                    </Link>
                </div>
            }
            <div className='container'>
                <div className={cx('home-products')}>
                    <div className='row'>
                        <div className='col-12'>
                            <div className={cx('section-title')}>
                                {productData ? (
                                    showBanner ? (
                                        <h2>{productData[0].category.name}</h2>
                                    ) : (
                                        <h2>{title}</h2>
                                    )
                                ) : (
                                    <Typography component='div' variant='h3' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Skeleton animation='wave' width={200} />
                                    </Typography>
                                )}
                            </div>
                        </div>
                        <div className='col-12'>
                            <Slider {...settings}>
                                {(productData ? productData : Array.from(new Array(10))).map((product, index) => (
                                    <div key={index} className='px-2 mt-2'>
                                        <Product data={product}></Product>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <div className='col-12'>
                            <div className={cx('more-link')}>
                                {productData ? (
                                    <Link to={moreLink}>Xem thêm &gt;&gt;</Link>
                                ) : (
                                    <Typography component='div' style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                                        <Skeleton animation='wave' width={100} />
                                    </Typography>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

HomeProduct.propTypes = {
    title: PropTypes.string.isRequired,
    showBanner: PropTypes.bool,
    apiUrl: PropTypes.string.isRequired,
    moreLink: PropTypes.string.isRequired
}

export default HomeProduct;