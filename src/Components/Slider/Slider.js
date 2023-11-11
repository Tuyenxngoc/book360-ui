import Slider from "react-slick";
import images from "~/assets/images";

import Style from './Slider.module.scss';
import classNames from "classnames/bind";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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

function Slide() {
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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Slider {...settings}>
                    {images.banners.map((image, index) => {
                        return (<div key={index} >
                            <Link to={'/test'}><img className={cx('img')} src={image} alt="banner"></img></Link>
                        </div>);
                    })}
                </Slider>
            </div>
        </div>
    );
}

export default Slide;