import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import request from "~/utils/request";
import Product from "~/components/Product";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import Style from './HomeProduct.module.scss'
import classNames from 'classnames/bind';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

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
        <div
            className={buttonClassName}
            style={style}
            onClick={onClick}
        >
            <FontAwesomeIcon className={cx('icon')} icon={props.icon}></FontAwesomeIcon>
        </div>
    );
}

function HomeProduct({ title, url }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        request
            .get(url)
            .then((response) => setData(response.data.data.items))
            .catch((error) => console.error(error));
    }, [url]);

    const settings = {
        infinite: true,
        speed: 800,
        slidesToShow: 5,
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

    return (
        <div className="container">
            <div className={cx('home-products')}>
                <div className="row">
                    <div className="col">
                        <div className={cx('section-title')}><h2>{title}</h2></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <Slider {...settings}>
                            {data.map((product) => {
                                return (
                                    <div key={product.productID} className="px-2">
                                        <Product data={product} ></Product>
                                    </div>
                                )
                            })}
                        </Slider>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className={cx('grid-item')}>
                            <Link to="/collections">Xem thêm &gt;&gt;</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
HomeProduct.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
}

export default HomeProduct;