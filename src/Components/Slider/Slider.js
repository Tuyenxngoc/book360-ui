import Slider from "react-slick";

import Style from './Slider.module.scss';
import classNames from "classnames/bind";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import CustomArrows from "../CustomArrows";
import { getBanners, getAllBanners } from "~/services/bannerService";

const cx = classNames.bind(Style);

const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 5000,
    nextArrow: <CustomArrows color="primary" isNextArrow />,
    prevArrow: <CustomArrows color="primary" />,
};

function Slide() {

    const [bannerData, setBannerData] = useState();

    useEffect(() => {
        getAllBanners()
            .then((response) => {
                setBannerData(response.data.data);
            })
            .catch((error) => { console.log(error); })
    }, []);

    return (
        <div className={cx('slide')}>
            {bannerData ? (
                <Slider {...settings}>
                    {bannerData.map((banner, index) => (
                        <div key={index}>
                            <Link to={banner.url || '/search?keyword='}>
                                <img className={cx('img')} src={banner.image} alt="banner" />
                            </Link>
                        </div>
                    ))}
                </Slider>
            ) : (
                <Skeleton animation="wave" variant="rectangular" height={400} />
            )}
        </div>
    );
}

export default Slide;