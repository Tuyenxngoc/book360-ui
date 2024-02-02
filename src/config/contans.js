export const API_URL = process.env.REACT_APP_BASE_URL;

export const ROLES = {
    'User': 'ROLE_USER',
    'Admin': 'ROLE_ADMIN',
}

export const billStatus = [
    {
        label: 'Tất cả',
        key: '',
    },
    {
        label: 'Chờ xác nhận',
        key: 'WAIT_FOR_CONFIRMATION',
    },
    {
        label: 'Chờ lấy hàng',
        key: 'WAIT_FOR_DELIVERY',
    },
    {
        label: 'Đang giao',
        key: 'DELIVERING',
    },
    {
        label: 'Đã giao',
        key: 'DELIVERED',
    },
    {
        label: 'Đã hủy',
        key: 'CANCELLED',
    },
    {
        label: 'Trả hàng/Hoàn tiền',
        key: 'REFUND',
    },
    {
        label: 'Giao không thành công',
        key: 'DELIVERY_FAILED',
    }
]

export const sizes = [
    { value: '8x10', label: '8x10' },
    { value: '11x14', label: '11x14' },
    { value: '12x12', label: '12x12' },
    { value: '16x20', label: '16x20' },
    { value: '18x24', label: '18x24' },
];

export const publishers = [
    { value: 'Kim Đồng', label: 'Kim Đồng' },
];

export const coverTypes = [
    { value: 'Bìa cứng', label: 'Bìa cứng' },
    { value: 'Bìa mềm', label: 'Bìa mềm' }
];

export const ages = [
    { value: 'PRESCHOOL', label: 'Nhà trẻ, Mẫu giáo (0-5 tuổi)' },
    { value: 'CHILD', label: 'Nhi đồng (6-10 tuổi)' },
    { value: 'ADOLESCENT', label: 'Thiếu niên (11-15 tuổi)' },
    { value: 'YOUNG_ADULT', label: 'Tuổi mới lớn (16-18 tuổi)' },
    { value: 'ADULT', label: 'Tuổi trưởng thành (Trên 18 tuổi)' },
];