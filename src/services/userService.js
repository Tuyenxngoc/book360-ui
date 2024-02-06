import { axiosPrivate } from "~/utils/httpRequest";

export const getCurrentUser = () => {
    return axiosPrivate.get('user/current');
}
