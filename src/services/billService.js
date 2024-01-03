import { axiosPrivate } from "~/utils/httpRequest"

export const cancelOrder = (customerId, billId) => {
    return axiosPrivate.patch(`bill/cancel-order/${customerId}/${billId}`);
}

export const buyAgain = (customerId, billId) => {
    return axiosPrivate.patch(`bill/buy-again/${customerId}/${billId}`);
}

export const getBillsByCustomerId = (customerId) => {
    const url = `bill/get-bills/${customerId}`;
    return axiosPrivate.get(url);
};

export const getBillInfo = (billId) => {
    const url = `bill/get-bill-infor/${billId}`;
    return axiosPrivate.get(url);
};

export const getCountBills = () => {
    return axiosPrivate.get('bill/get-count-bill');
}

export const getAllBills = (paramsString) => {
    return axiosPrivate.get(`bill/get-all-bills?${paramsString}`);
}

export const getStatistic = (paramsString) => {
    return axiosPrivate.get(`bill/get-statistic?${paramsString}`, {
        responseType: 'blob',
    });
}

export const updateBillStatus = (billId, paramsString) => {
    return axiosPrivate.put(`bill/update-status/${billId}?${paramsString}`);
}

export const getCountBillByStatus = () => {
    return axiosPrivate.get('bill/get-bills-by-status?status=');
}

export const orderFromCart = (customerId, values) => {
    return axiosPrivate.post(`bill/order-from-cart/${customerId}`, values);
}