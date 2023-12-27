import httpRequest, { axiosPrivate } from "~/utils/httpRequest";

export const getBanner = (bannerId) => {
    return axiosPrivate.get(`banner/get-banner/${bannerId}`);
}

export const getAllBanners = (paramsString) => {
    return httpRequest.get(`banner/get-banners?${paramsString}`);
}

export const createBanner = (bannerId, values) => {
    const banner = {
        id: bannerId,
        ...values,
    }
    return axiosPrivate.post('banner/create-banner', banner);
}

export const deleteBanner = (bannerId) => {
    return axiosPrivate.delete(`banner/delete-banner/${bannerId}`);
}
