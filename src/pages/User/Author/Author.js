import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductList from "~/components/User/ProductList";
import { getProductByAuthorId } from "~/services/productService";

function Author() {

    const { authorId } = useParams();

    const [data, setData] = useState({});
    const [filters, setFilters] = useState({
        sortBy: 'createdDate',
        isAscending: false,
        pageNum: 1,
        pageSize: 10,
    })

    const handlePageChange = (pageNumber) => {
        setFilters((prevFilters) => ({ ...prevFilters, pageNum: pageNumber }));
    };

    const handleSortChange = (newSortBy, newIsAscending = false) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sortBy: newSortBy,
            isAscending: newIsAscending,
        }));
    };

    useEffect(() => {
        getProductByAuthorId(authorId)
            .then((response) => {
                setData(response.data.data);
            })
            .catch((error) => {
                toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
            });
    }, [authorId]);

    return (
        <ProductList
            currentPage='Kết quả tìm kiếm'
            products={data.items}
            pagination={data.meta}
            filters={filters}
            handleSortChange={handleSortChange}
            handlePageChange={handlePageChange}
        ></ProductList>
    );
}

export default Author;