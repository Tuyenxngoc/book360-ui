import httpRequest, { axiosPrivate } from "~/utils/httpRequest";

export const getCategory = (categoryId) => {
    return axiosPrivate.get(`category/get-category/${categoryId}`);
}

export const getCategories = (paramsString) => {
    return httpRequest.get(`category/get-categories?${paramsString}`);
}

export const getAllCategories = (paramsString) => {
    return axiosPrivate.get(`category/get-all-categories?${paramsString}`);
}

export const createCategory = (categoryId, value) => {
    const category = {
        id: categoryId,
        ...value
    };
    const url = 'category/create-category';

    return axiosPrivate.post(url, category);
}

export const deleteCategory = (categoryId) => {
    return axiosPrivate.delete(`category/delete-category/${categoryId}`);
}