import httpRequest, { axiosPrivate } from "~/utils/httpRequest";

export const register = (values) => {
    return httpRequest.post('auth/register', values);
}

export const refreshToken = (values) => {
    return httpRequest.post('auth/refresh-token', values);
}

export const logoutToken = () => {
    return axiosPrivate.post('auth/logout');
}

export const login = (values) => {
    return httpRequest.post('auth/login', values);
}

export const forgetPassword = (values) => {
    return httpRequest.post('auth/forget-password', values);
}

export const changePassword = (values) => {
    return axiosPrivate.patch('auth/change-password', values);
}
