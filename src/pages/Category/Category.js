import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import httpRequest from "~/utils/httpRequest";
import queryString from "query-string";
import ProductList from "~/components/ProductList";

function Category({ keyword = '', sortBy = 'createdDate', isAscending = false }) {
    const { id } = useParams();
    const [data, setData] = useState({});
    const [filters, setFilters] = useState({
        keyword: keyword,
        sortBy: sortBy,
        isAscending: isAscending,
        pageNum: 1,
        pageSize: 10,
    })
    //Đọc dữ liệu
    useEffect(() => {
        const paramsString = queryString.stringify(filters);
        httpRequest
            .get(`product/get-products-by-categoryId/${id}/?${paramsString}`)
            .then((response) => { setData(response.data.data) })
            .catch((error) => console.error(error));
    }, [filters, id]);
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
    return (
        <ProductList
            currentPage='Danh mục'
            products={data.items}
            pagination={data.meta}
            filters={filters}
            handleSortChange={handleSortChange}
            handlePageChange={handlePageChange}
        ></ProductList>
    )
}
export default Category;