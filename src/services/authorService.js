import { axiosPrivate } from "~/utils/httpRequest";

export const getAllAuthors = () => {
    return axiosPrivate.get('admin/author/all');
}

export const getAuthors = (params) => {
    return axiosPrivate.get(`admin/author/get?${params}`);
}

export const getAuthor = (authorId) => {
    return axiosPrivate.get(`admin/author/${authorId}`);
}

export const createAuthor = (values) => {
    return axiosPrivate.put('admin/author/create', values);
}

export const deleteAuthor = (authorId) => {
    return axiosPrivate.delete(`admin/author/delete/${authorId}`);
}