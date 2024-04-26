import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Style from './InputNumber.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Style);

function isInterger(str) {
    // Check if the string contains only digits
    return /^\d+$/.test(str);
}

const defaultValue = '1';

function InputNumber({ maxQuantity = 100, setQuantity, square = false }) {
    const [quantityString, setQuantityString] = useState(defaultValue);

    const increaseQuantity = () => {
        let quantity = parseInt(quantityString, 10);
        if (quantity < maxQuantity) {
            setQuantityString(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        let quantity = parseInt(quantityString, 10);
        if (quantity > 1) {
            setQuantityString(quantity - 1);
        }
    };

    const handleQuantityChange = (event) => {
        const value = event.target.value;
        if (isInterger(value) || value === '') {
            setQuantityString(value);

            if (value !== '' && parseInt(value, 10) > maxQuantity) {
                setQuantityString(maxQuantity);
            }

            if (value === '0') {
                setQuantityString(defaultValue);
            }
        }
    };

    const handleQuantityBlur = (event) => {
        const value = event.target.value;
        if (value === '') {
            setQuantityString(defaultValue);
        }
    };

    useEffect(() => {
        if (isInterger(quantityString)) {
            setQuantity(parseInt(quantityString, 10));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantityString]);

    return (
        <div className={cx('wrapper', { square })}>
            <button
                className={cx('btn', 'decrease', { disable: quantityString === '' })}
                onClick={decreaseQuantity}
                disabled={quantityString === ''}
            >
                <FontAwesomeIcon icon={faMinus} />
            </button>
            <input
                disabled={maxQuantity === 0}
                value={quantityString}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                className={cx('input')}
                type="text"
            />
            <button
                className={cx('btn', 'increase', { disable: quantityString === '' })}
                onClick={increaseQuantity}
                disabled={quantityString === ''}
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </div>
    );
}

InputNumber.propTypes = {
    maxQuantity: PropTypes.number,
    setQuantity: PropTypes.func,
    square: PropTypes.bool,
};

export default InputNumber;
