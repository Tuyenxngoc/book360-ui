import { axiosPrivate } from "~/utils/httpRequest";

export const getAllAuthors = () => {
    return axiosPrivate.get('admin/author/all');
}