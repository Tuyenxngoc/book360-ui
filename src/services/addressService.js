import { axiosPrivate } from '~/utils/httpRequest';

export const getAddresses = () => {
    return axiosPrivate.get('address/get');
};

export const getAddresse = (addressId) => {
    return axiosPrivate.get(`address/${addressId}`);
};

export const deleteAddress = (addressId) => {
    return axiosPrivate.delete(`address/delete/${addressId}`);
};

export const setDefaultAddress = (addressId) => {
    return axiosPrivate.patch(`address/set-default/${addressId}`);
};

export const saveLocationCustomer = (addressId, values) => {
    const data = {
        addressId,
        ...values,
    };

    return axiosPrivate.put('address/create', data);
};
