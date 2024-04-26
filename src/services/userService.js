import { axiosPrivate } from '~/utils/httpRequest';

export const getCurrentUserLogin = () => {
    return axiosPrivate.get('user/current');
};
