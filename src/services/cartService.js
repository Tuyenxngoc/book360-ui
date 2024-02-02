import { axiosPrivate } from "~/utils/httpRequest"

export const updateCartDetail = (valus) => {
    return axiosPrivate.put('cart/product/update', valus);
}

export const addProductToCart = (valus) => {
    return axiosPrivate.post('cart/product/add', valus);
}

export const getTotalProductFromCart = () => {
    return axiosPrivate.get('cart/product/total');
}

export const getProductFromCart = () => {
    return axiosPrivate.get('cart/product/get');
}

export const deleteProductFromCart = (productId) => {
    return axiosPrivate.get(`cart/product/delete/${productId}`);
}