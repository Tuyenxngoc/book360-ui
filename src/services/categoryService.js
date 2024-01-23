import httpRequest, { axiosPrivate } from "~/utils/httpRequest";

export const getCategories = (params) => {
    return httpRequest.get(`category/get?${params}`);
}


export const getCategory = (categoryId) => {
    return axiosPrivate.get(`admin/category/${categoryId}`);
}

export const getAllCategories = () => {
    return axiosPrivate.get('admin/category/all');
}

export const getCategoriesForAdmin = (params) => {
    return axiosPrivate.get(`admin/category/get?${params}`);
}

export const createCategory = (id, value) => {
    const category = {
        id,
        ...value
    };
    const url = 'admin/category/create';

    return axiosPrivate.post(url, category);
}

export const deleteCategory = (categoryId) => {
    return axiosPrivate.delete(`admin/category/delete/${categoryId}`);
}