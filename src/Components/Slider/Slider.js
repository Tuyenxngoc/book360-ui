import Slider from "react-slick";

import Style from './Slider.module.scss';
import classNames from "classnames/bind";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import httpRequest from "~/utils/httpRequest";
import { Skeleton } from "@mui/material";

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

const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 5000,
    nextArrow: <ControlButton NextArrow />,
    prevArrow: <ControlButton PrevArrow />,
};

function Slide() {

    const [bannerData, setBannerData] = useState();

    useEffect(() => {
        httpRequest.get('banner/get-banners')
            .then((response) => {
                setBannerData(response.data.data)
            })
            .catch((error) => { console.log(error); })
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                {bannerData ? (
                    <Slider {...settings}>
                        {bannerData.map((banner, index) => (
                            <div key={index}>
                                <Link to={'/test'}>
                                    <img className={cx('img')} src={banner.image} alt="banner" />
                                </Link>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <Skeleton animation="wave" variant="rectangular" height={400} />
                )}
            </div>
        </div>
    );
}

export default Slide;