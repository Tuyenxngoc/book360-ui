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

export const getAllCustomer = (params) => {
    return axiosPrivate.get(`customer/get-customers?${params}`);
}

export const getCountCustomer = () => {
    return axiosPrivate.get('customer/get-count-customer');
}

export const uploadImage = (file) => {
    uploadImages(file);
}

export const uploadImages = (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    return axiosPrivate.post('admin/customer/upload-images', formData, {
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

export const getFavoriteProducts = () => {
    return axiosPrivate.get(`customer/favorite-products`);
}

export const checkFavoriteProduct = (productId) => {
    return axiosPrivate.get(`customer/favorite-products/${productId}`);
}

export const addFavoriteProduct = (productId) => {
    return axiosPrivate.post(`customer/favorite-products/${productId}`);
}

export const removeFavoriteProduct = (productId) => {
    return axiosPrivate.delete(`customer/favorite-products/${productId}`);
}

export const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axiosPrivate.post('customer/upload-avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
