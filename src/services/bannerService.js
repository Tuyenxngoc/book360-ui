import httpRequest, { axiosPrivate } from "~/utils/httpRequest";

export const getBanner = (bannerId) => {
    return axiosPrivate.get(`banner/get-banner/${bannerId}`);
}

export const getBanners = (paramsString) => {
    return httpRequest.get(`banner/get-banners?${paramsString}`);
}

export const getAllBanners = () => {
    return httpRequest.get('banner/get-all-banners');
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
