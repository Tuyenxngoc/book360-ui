import httpRequest from "~/utils/httpRequest";

export const getAllCategories = () => {
    return httpRequest.get('category/get-categories');
}
