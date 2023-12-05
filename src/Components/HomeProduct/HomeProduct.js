import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
//Component
import httpRequest from "~/utils/httpRequest";
import Product from "~/components/Product/Product";
//Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
//Style
import Style from './HomeProduct.module.scss'
import classNames from 'classnames/bind';
//Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import images from "~/assets";
import { Skeleton, Typography } from "@mui/material";

const cx = classNames.bind(Style);

function ControlButton({ className, style, onClick, NextArrow = false, PrevArrow = false }) {
    const props = {};
    if (NextArrow) {
        props.type = 'custom-next-arrow';
        props.icon = faAngleRight;
    } else if (PrevArrow) {
        props.type = 'custom-prev-arrow';
        props.icon = faAngleLeft;
    }
    const buttonClassName = cx(className, 'custom-slick-arrow', props.type);
    return (
        <div className={buttonClassName} style={style} onClick={onClick}>
            <FontAwesomeIcon className={cx('icon')} icon={props.icon}></FontAwesomeIcon>
        </div>
    );
}

const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <ControlButton NextArrow />,
    prevArrow: <ControlButton PrevArrow />,
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

function HomeProduct({ title, bannerIndex, apiUrl, moreLink }) {

    const [productData, setProductData] = useState();

    useEffect(() => {
        httpRequest
            .get(apiUrl)
            .then((response) => setProductData(response.data.data.items))
            .catch((error) => console.error(error));
    }, [apiUrl]);

    return (
        <>
            {bannerIndex >= 0 &&
                <div className={cx('banner-home-pro')}>
                    <Link className={cx('banner-home-pro-link')} to={moreLink}>
                        {productData ? (
                            <img src={images.bannerPro[bannerIndex]} alt='home-banner' />
                        ) : (
                            <Skeleton variant="rectangular" fitContent height={120} />
                        )}
                    </Link>
                </div>
            }
            <div className="container">
                <div className={cx('home-products')}>
                    <div className="row">
                        <div className="col-12">
                            <div className={cx('section-title')}>
                                {productData ? (
                                    <h2>{title}</h2>
                                ) : (
                                    <Typography component="div" variant='h3' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Skeleton width={200} />
                                    </Typography>
                                )}
                            </div>
                        </div>
                        <div className="col-12">
                            <Slider {...settings}>
                                {(productData ? productData : Array.from(new Array(10))).map((product, index) => {
                                    return (
                                        <div key={index} className="px-2 mt-2">
                                            <Product data={product}></Product>
                                        </div>
                                    );
                                })}
                            </Slider>
                        </div>
                        <div className="col-12">
                            <div className={cx('grid-item')}>
                                {productData ? (
                                    <Link to={moreLink}>Xem thêm &gt;&gt;</Link>
                                ) : (
                                    <Typography component="div" style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
                                        <Skeleton width={100} />
                                    </Typography>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

HomeProduct.propTypes = {
    title: PropTypes.string.isRequired,
    bannerIndex: PropTypes.number,
    apiUrl: PropTypes.string.isRequired,
    moreLink: PropTypes.string.isRequired
}

export default HomeProduct;