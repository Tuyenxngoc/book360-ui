import { axiosPrivate } from "~/utils/httpRequest";

export const getAllProducts = (paramsString) => {
    return axiosPrivate.get(`product/get-products-admin?${paramsString}`);
}

export const getCountProducts = () => {
    return axiosPrivate.get('product/get-quantity');
}

export const createProduct = (id, { name, price, description, images, discount, author, size, quantity, cate_id }) => {
    const product = {
        id,
        name,
        price: Number(price),
        description,
        images,
        discount: Number(discount),
        author,
        size,
        quantity: Number(quantity),
        cate_id: Number(cate_id)
    }
    return axiosPrivate.post('product/create-product', product);
}

export const updateProduct = (productId, values) => {
    return axiosPrivate.put(`product/update-product/${productId}`, values,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
}

export const deleteProduct = (productId) => {
    return axiosPrivate.delete(`product/delete-product/${productId}`);
}

export const getDetailProduct = (productId) => {
    return axiosPrivate.get(`product/get-product-detail/${productId}`);
}