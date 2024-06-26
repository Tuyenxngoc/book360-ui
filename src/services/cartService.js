import { axiosPrivate } from '~/utils/httpRequest';

export const getTotalProducts = () => {
    return axiosPrivate.get('cart/product/total');
};

export const addProductToCart = (productId, quantity) => {
    const data = { productId, quantity };
    return axiosPrivate.post('cart/product/add', data);
};

export const getProductsFromCart = () => {
    return axiosPrivate.get('cart/product/get');
};

export const updateCartDetail = (productId, quantity) => {
    const data = { productId, quantity };
    return axiosPrivate.put('cart/product/update', data);
};

export const deleteProductFromCart = (productId) => {
    return axiosPrivate.delete(`cart/product/delete/${productId}`);
};
