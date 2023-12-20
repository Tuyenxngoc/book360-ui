export const API_URL = process.env.REACT_APP_BASE_URL;

export const ROLES = {
    'User': "ROLE_USER",
    'Admin': "ROLE_ADMIN",
}

export const orderStatus = [
    {
        label: 'Tất cả',
        key: '',
    },
    {
        label: 'Chờ xử lý',
        key: "to_pay",
    },
    {
        label: 'Đang giao hàng',
        key: "to_receive",
    },
    {
        label: 'Đặt hàng thành công',
        key: "ordered",
    },
    {
        label: 'Đã giao',
        key: "completed",
    },
    {
        label: 'Đã hủy',
        key: "canceled",
    }
]