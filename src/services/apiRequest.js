import { axiosPrivate } from "~/utils/httpRequest";

export const getCurrentUserLogin = () => {
    return axiosPrivate.get(`user/current`);
}

export const addProductToCart = (customerId, productId, quantity) => {
    const data = { productId, quantity, }
    const url = `cart-detail/add-product-to-cart/${customerId}`;

    return axiosPrivate.post(url, data)
}

export const updatedCartItems = (customerId, productId, quantity) => {
    const data = { productId, quantity };
    const url = `cart/update-cart-infor/${customerId}`;

    return axiosPrivate.put(url, data);
}

export const removeCartItems = (customerId, productId) => {
    const url = `cart/delete-product-from-cart/${customerId}/${productId}`;

    return axiosPrivate.delete(url);
};
