import { axiosPrivate } from '~/utils/httpRequest';

export const getSupportUser = () => {
    return axiosPrivate.get('chat/support-user');
};

export const getChatRooms = () => {
    return axiosPrivate.get('chatrooms');
};

export const getMessages = (chatRoomId) => {
    return axiosPrivate.get(`chatrooms/${chatRoomId}/messages`);
};

export const getUserSendMessages = () => {
    return axiosPrivate.get('admin/message/get-users');
};
