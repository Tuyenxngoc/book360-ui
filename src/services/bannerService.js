import httpRequest from "~/utils/httpRequest";

export const getAllBanners = () => {
    return httpRequest.get('banner/get-banners');
}
