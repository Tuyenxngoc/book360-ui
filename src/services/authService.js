import { axiosPrivate } from "~/utils/httpRequest";

export const register = (values, params) => {
    return axiosPrivate.post(`auth/register?${params}`, values);
}

export const refreshToken = (values) => {
    return axiosPrivate.post('auth/refresh-token', values);
}

export const logout = () => {
    return axiosPrivate.post('auth/logout');
}

export const login = (values) => {
    return axiosPrivate.post('auth/login', values);
}

export const forgetPassword = (values) => {
    return axiosPrivate.post('auth/forget-password', values);
}

export const changePassword = (values) => {
    return axiosPrivate.patch('auth/change-password', values);
}
