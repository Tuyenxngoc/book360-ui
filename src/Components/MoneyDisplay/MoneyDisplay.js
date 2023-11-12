const MoneyDisplay = ({ amount }) => {
    // Hàm định dạng số tiền
    const formatMoney = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <>
            {formatMoney(amount)}
        </>
    );
};

export default MoneyDisplay;