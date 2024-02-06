import { axiosPrivate } from "~/utils/httpRequest";

export const getAllBookSet = () => {
    return axiosPrivate.get('admin/book-set/all');
}

export const getBookSets = (params) => {
    return axiosPrivate.get(`admin/book-set/get?${params}`);
}

export const getBookSet = (bookSetId) => {
    return axiosPrivate.get(`admin/book-set/${bookSetId}`);
}

export const createBookSet = (values) => {
    return axiosPrivate.put('admin/book-set/create', values);
}

export const deleteBookSet = (bookSetId) => {
    return axiosPrivate.delete(`admin/book-set/delete/${bookSetId}`);
}