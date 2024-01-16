import { axiosPrivate } from "~/utils/httpRequest"

export const getTotalProducts = () => {
    return axiosPrivate.get('cart/get-total-products');
}
