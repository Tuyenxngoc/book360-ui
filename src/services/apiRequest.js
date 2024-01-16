import { axiosPrivate } from "~/utils/httpRequest";

export const getCurrentUserLogin = () => {
    return axiosPrivate.get(`user/current`);
}

export const getCustomer = (userId) => {
    return axiosPrivate.get(`customer/get-by-user/${userId}`);
}

export const addProductToCart = (productId, quantity) => {
    const data = { productId, quantity }
    const url = 'cart/add-product';

    return axiosPrivate.post(url, data)
}

export const updatedCartItems = (productId, quantity) => {
    const data = { productId, quantity };
    const url = 'cart/update-cart';

    return axiosPrivate.put(url, data);
}

export const removeCartItems = (productId) => {
    const url = `cart/delete-product/${productId}`;

    return axiosPrivate.delete(url);
};
