import { axiosPrivate } from "~/utils/httpRequest";

export const createCustomer = (values) => {
    return axiosPrivate.post('auth/admin-register', values);
}

export const deleteCustomer = (customerId) => {
    return axiosPrivate.delete(`customer/${customerId}`);
}

export const getCustomer = (userId) => {
    return axiosPrivate.get(`customer/get-by-user/${userId}`);
}

export const getAllCustomer = (paramsString) => {
    return axiosPrivate.get(`customer?${paramsString}`);
}

export const getCountCustomer = () => {
    return axiosPrivate.get('customer/get-count-customer');
}

export const uploadImage = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axiosPrivate.post(`customer/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export const customerUpload = async ({ file, onSuccess, onError }) => {
    try {
        const response = await uploadImage(file);
        onSuccess(response.data.data, file);
    } catch (error) {
        onError(error);
    }
};

export const updateCustomer = (customerId, { name, phonenumber, address, avatar }) => {
    const customerInfo = { name, phonenumber, address, avatar };
    return axiosPrivate.put(`customer/${customerId}`, customerInfo);
}

export const getFavoriteProducts = (customerId) => {
    return axiosPrivate.get(`customer/${customerId}/favorite-products`);
}

export const checkFavoriteProduct = (customerId, productId) => {
    return axiosPrivate.get(`customer/${customerId}/favorite-products/${productId}`);
}

export const addFavoriteProduct = (customerId, productId) => {
    return axiosPrivate.post(`customer/${customerId}/favorite-products/${productId}`);
}

export const removeFavoriteProduct = (customerId, productId) => {
    return axiosPrivate.delete(`customer/${customerId}/favorite-products/${productId}`);
}

