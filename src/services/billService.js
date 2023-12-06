import { axiosPrivate } from "~/utils/httpRequest"

export const cancelOrder = (customerId, billId) => {
    return axiosPrivate.patch(`bill/cancel-order/${customerId}/${billId}`);
}

export const buyAgain = (customerId, billId) => {
    return axiosPrivate.patch(`bill/buy-again/${customerId}/${billId}`);
}