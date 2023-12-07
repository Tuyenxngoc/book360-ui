import { axiosPrivate } from "~/utils/httpRequest"

export const getTotalProducts = (customerId) => {
    return axiosPrivate.get(`cart/total-product/${customerId}`);
}
