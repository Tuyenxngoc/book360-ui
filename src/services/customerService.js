import { axiosPrivate } from "~/utils/httpRequest";

export const getCustomer = (userId) => {
    return axiosPrivate.get(`customer/get-by-user/${userId}`);
}

export const updateCustomer = (customerId, { name, phonenumber, address, avatar }) => {

    const customerInfo = { name, phonenumber, address }

    if (avatar instanceof File) {
        customerInfo.avatar = avatar;
    }

    return axiosPrivate.put(`customer/${customerId}`, customerInfo, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}
