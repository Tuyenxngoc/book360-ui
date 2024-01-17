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

export const getCountBills = () => {
    const url = 'bill/get-count-bills';
    return axiosPrivate.get(url);
};

export const getBillInfo = (billId) => {
    const url = `bill/get-bill-infor/${billId}`;
    return axiosPrivate.get(url);
};

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

export const getTodo = () => {
    return axiosPrivate.get('customer/get-todo');
}

export const saveOrder = (values) => {
    return axiosPrivate.post('bill/save-order', values);
}