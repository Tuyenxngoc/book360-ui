import { axiosPrivate } from "~/utils/httpRequest";

export const changePassword = (values) => {
    return axiosPrivate.patch('auth/change-password', values);
}

export const logoutToken = () => {
    return axiosPrivate.post('auth/logout');
}
