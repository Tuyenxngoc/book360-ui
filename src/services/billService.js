import { axiosPrivate } from "~/utils/httpRequest"

export const cancelOrder = (billId) => {
    return axiosPrivate.patch(`bill/cancel-order/${billId}`);
}

export const buyAgain = (billId) => {
    return axiosPrivate.patch(`bill/buy-again/${billId}`);
}

export const getBills = (status) => {
    const url = `bill/get-bills?billStatus=${status}`;
    return axiosPrivate.get(url);
};

export const getCountBillByStatus = () => {
    const url = 'bill/get-count-bills-by-status';
    return axiosPrivate.get(url);
};

export const getCountBills = () => {
    const url = 'bill/get-count-bills';
    return axiosPrivate.get(url);
};

export const getBillInfo = (billId) => {
    const url = `bill/get-bill-infor/${billId}`;
    return axiosPrivate.get(url);
};

export const getAllBills = (params) => {
    return axiosPrivate.get(`bill/get-all-bills?${params}`);
}

export const getStatistic = (params) => {
    return axiosPrivate.get(`bill/get-statistic?${params}`, {
        responseType: 'blob',
    });
}

export const updateBillStatus = (billId, params) => {
    return axiosPrivate.put(`bill/update-status/${billId}?${params}`);
}

export const getTodo = () => {
    return axiosPrivate.get('customer/get-todo');
}

export const saveOrder = (values) => {
    return axiosPrivate.post('bill/save-order', values);
}