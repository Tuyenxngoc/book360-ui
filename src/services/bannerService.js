import httpRequest, { axiosPrivate } from "~/utils/httpRequest";

export const getAllBanners = () => {
    return httpRequest.get('banner/all');
}


export const getBanner = (bannerId) => {
    return axiosPrivate.get(`admin/banner/${bannerId}`);
}

export const getBanners = (params) => {
    return axiosPrivate.get(`admin/banner/get?${params}`);
}

export const createBanner = (id, values) => {
    const banner = {
        id,
        ...values,
    }
    return axiosPrivate.post('admin/banner/create', banner);
}

export const deleteBanner = (bannerId) => {
    return axiosPrivate.delete(`admin/banner/delete/${bannerId}`);
}
