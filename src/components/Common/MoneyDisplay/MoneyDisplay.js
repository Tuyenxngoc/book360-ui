import PropTypes from 'prop-types'

function MoneyDisplay({ amount, discountPercent = 0 }) {

    const formatMoney = (value, discountPercent) => {
        const discountedAmount = discountPercent > 0 ? value - (value * discountPercent / 100) : value;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountedAmount);
    };

    return (
        <>
            {formatMoney(amount, discountPercent)}
        </>
    );
};

MoneyDisplay.propTypes = {
    amount: PropTypes.number.isRequired,
    discountPercent: PropTypes.number,
}

export default MoneyDisplay;