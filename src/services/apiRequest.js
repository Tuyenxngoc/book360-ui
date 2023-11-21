import httpRequest, { axiosPrivate } from "~/utils/httpRequest";
import { toast } from "react-toastify";

export const getCurrentUserLogin = (token) => {
    return httpRequest
        .get(`/user/current`, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            }
        });
}

export const addProductToCart = (userId, productId, quantity) => {
    const data = {
        productId: productId,
        quantity: quantity,
    }

    axiosPrivate.post(`/cart-detail/add-product-to-cart/${userId}`, data)
        .then(response => {
            console.log(response.data);
            toast.success('Thêm vào giỏ hàng thành công!', {
                position: 'top-right',
                autoClose: 2000
            });
        })
        .catch(error => {
            console.error(error);
            toast.info('Đăng nhập để thêm vào giỏ hàng', {
                position: 'top-right',
                autoClose: 2000
            });
        });
}