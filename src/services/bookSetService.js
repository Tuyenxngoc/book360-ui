import { axiosPrivate } from "~/utils/httpRequest";

export const getAllBookSet = () => {
    return axiosPrivate.get('admin/book-set/all');
}