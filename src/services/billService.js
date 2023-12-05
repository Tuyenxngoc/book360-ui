import { axiosPrivate } from "~/utils/httpRequest"

export const cancelOrder = (billId) => {
    return axiosPrivate.put(`bill/cancel-order/${billId}`);
}

export const buyAgain = (billId) => {
    return axiosPrivate.put(`bill/buy-again/${billId}`);
}