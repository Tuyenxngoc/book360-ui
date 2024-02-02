import httpRequest, { axiosPrivate } from "~/utils/httpRequest";

export const getProductSameAuthor = (productId, params) => {
    return httpRequest.get(`product/same-author/${productId}?${params}`);
}

export const getProducts = (params) => {
    return httpRequest.get(`product/get?${params}`);
}

export const findProducts = (params) => {
    return httpRequest.get(`product/find?${params}`);
}

export const getProductDetails = (productId) => {
    return httpRequest.get(`product/detail/${productId}`);
}

export const getProductByCategoryId = (categoryId, params) => {
    return httpRequest.get(`product/category/${categoryId}?${params}`);
}

export const getProductByAuthorId = (authorId) => {
    return httpRequest.get(`product/author/${authorId}`);
}


export const getProduct = (productId) => {
    return axiosPrivate.get(`admin/product/${productId}`);
}

export const getProductsForAdmin = (params) => {
    return axiosPrivate.get(`admin/product/get?${params}`);
}

export const getStockQuantity = () => {
    return axiosPrivate.get('admin/product/stock-quantity');
}

export const createProduct = (id, values) => {
    const product = {
        id,
        ...values,
    }
    return axiosPrivate.put('admin/product/create', product);
}

export const deleteProduct = (productId) => {
    return axiosPrivate.delete(`admin/product/delete/${productId}`);
}