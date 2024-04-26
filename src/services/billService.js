import { axiosPrivate } from '~/utils/httpRequest';

export const saveOrder = (values) => {
    return axiosPrivate.post('bill/save-order', values);
};

export const cancelOrder = (billId, params) => {
    return axiosPrivate.patch(`bill/cancel-order/${billId}?${params}`);
};

export const getBills = (params) => {
    return axiosPrivate.get(`bill/get?${params}`);
};

export const getBillDetail = (billId) => {
    return axiosPrivate.get(`bill/detail/${billId}`);
};

export const getCountBillByStatus = (billStatus) => {
    return axiosPrivate.get(`bill/count?billStatus=${billStatus}`);
};

export const updateBillStatus = (billId, billStatus) => {
    return axiosPrivate.patch(`admin/bill/update-status/${billId}?billStatus=${billStatus}`);
};

export const getBill = (billId) => {
    return axiosPrivate.get(`admin/bill/${billId}`);
};

export const getBillsForAdmin = (params) => {
    return axiosPrivate.get(`admin/bill/get?${params}`);
};

export const getCountBill = () => {
    return axiosPrivate.get('admin/bill/count');
};

export const getStatistic = () => {
    return axiosPrivate.get('admin/bill/count');
};

export const getKeyMetrics = () => {
    return axiosPrivate.get('admin/bill/key-metrics');
};
