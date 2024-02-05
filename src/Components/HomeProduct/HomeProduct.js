import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Product from '~/components/Product/Product';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import Style from './HomeProduct.module.scss'
import classNames from 'classnames/bind';
import { Skeleton, Typography } from '@mui/material';
import CustomArrows from '../CustomArrows';
import { getProductByCategoryId, getProducts } from '~/services/productService';
import queryString from 'query-string';

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
};

function HomeProduct({ title, showProductByCategory = false, categoryId, moreLink, sortBy }) {

    const [productsData, setProductsData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = queryString.stringify({ sortBy });
                const response = showProductByCategory
                    ? await getProductByCategoryId(categoryId, params)
                    : await getProducts(params);
                setProductsData(response.data.data.items);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='home-product'>
            {showProductByCategory &&
                <div className={cx('banner-home-pro')}>
                    <Link className={cx('banner-home-pro-link')} to={moreLink}>
                        {productsData ? (
                            productsData[0]?.category?.image && (<img src={productsData[0].category.image} alt='home-banner' />)
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
                                {productsData ? (
                                    showProductByCategory ? (
                                        <h2>{productsData[0]?.category?.name}</h2>
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
                                {(productsData ? productsData : Array.from({ length: 10 })).map((product, index) => (
                                    <div key={index} className='px-2 mt-2'>
                                        <Product data={product}></Product>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                        <div className='col-12'>
                            <div className={cx('more-link')}>
                                {productsData ? (
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
    title: PropTypes.string,
    showProductByCategory: PropTypes.bool,
    categoryId: PropTypes.number,
    moreLink: PropTypes.string.isRequired,
    sortBy: PropTypes.string.isRequired,
}

export default HomeProduct;