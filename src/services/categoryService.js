import httpRequest, { axiosPrivate } from "~/utils/httpRequest";

export const getAllCategories = () => {
    return httpRequest.get('category/get-categories');
}

export const createCategory = (categoryId, value) => {
    return axiosPrivate.post(`category/create-category/${categoryId}`, value);
}

export const deleteCategory = (categoryId) => {
    return axiosPrivate.delete(`category/delete-category/${categoryId}`);
}