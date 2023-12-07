import { axiosPrivate } from "~/utils/httpRequest";

export const changePassword = (username, values) => {
    return axiosPrivate.patch(`auth/change-password/${username}`, values);
}
