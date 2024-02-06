import { axiosPrivate } from "~/utils/httpRequest";

export const getCurrentUserLogin = () => {
    return axiosPrivate.get(`user/current`);
}

export const getCustomer = (userId) => {
    return axiosPrivate.get(`customer/get-by-user/${userId}`);
}