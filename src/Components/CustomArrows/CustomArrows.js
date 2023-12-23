import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleLeft, faAngleRight, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import Style from './CustomArrows.module.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(Style);

function CustomArrows({ className, style, onClick, isNextArrow = false, isVertical = false, color }) {

    const icon = isVertical
        ? (isNextArrow ? faAngleDown : faAngleUp)
        : (isNextArrow ? faAngleRight : faAngleLeft);
    const name = isVertical
        ? (isNextArrow ? 'down-arrow' : 'up-arrow')
        : (isNextArrow ? 'right-arrow' : 'left-arrow');

    return (
        <div
            className={cx(...className.split(' '), color, name)}
            style={{ ...style, }}
            onClick={onClick}
        >
            <FontAwesomeIcon className={Style.icon} icon={icon} />
        </div>
    );
}

CustomArrows.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    isNextArrow: PropTypes.bool,
    isVertical: PropTypes.bool,
    color: PropTypes.string,
};

export default CustomArrows;
