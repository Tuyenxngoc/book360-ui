export const API_URL = process.env.REACT_APP_BASE_URL;

export const ROLES = {
    'User': 'ROLE_USER',
    'Admin': 'ROLE_ADMIN',
}

export const orderStatus = [
    {
        label: 'Tất cả',
        key: '',
    },
    {
        label: 'Chờ xác nhận',
        key: 'unpaid',
    },
    {
        label: 'Chờ lấy hàng',
        key: 'to_ship',
    },
    {
        label: 'Đang giao',
        key: 'shipping',
    },
    {
        label: 'Đã giao',
        key: 'completed',
    },
    {
        label: 'Đã hủy',
        key: 'cancelled',
    },
    {
        label: 'Trả hàng/Hoàn tiền',
        key: 'refund',
    },
    {
        label: 'Giao không thành công',
        key: 'delivery_failed',
    }
]