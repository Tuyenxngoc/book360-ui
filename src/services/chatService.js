import { axiosPrivate } from '~/utils/httpRequest';

export const getMessages = () => {
    return axiosPrivate.get('message/get');
};

export const getUserSendMessages = () => {
    return axiosPrivate.get('admin/message/get-users');
};
