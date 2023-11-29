import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import httpRequest from '~/utils/httpRequest';
import ProductList from '~/components/ProductList';

function SearchResults() {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const keyword = queryParams.keyword || '';
    const sortBy = queryParams.sortBy || 'createdDate';

    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        sortBy,
        isAscending: false,
        pageNum: 1,
        pageSize: 10,
    })

    useEffect(() => {
        const paramsString = queryString.stringify({ ...filters, keyword });
        httpRequest
            .get(`product/find-product?${paramsString}`)
            .then((response) => setData(response.data.data))
            .catch((error) => console.error(error));
    }, [filters, keyword]);

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
            currentPage='Kết quả tìm kiếm'
            products={data.items}
            pagination={data.meta}
            filters={filters}
            handleSortChange={handleSortChange}
            handlePageChange={handlePageChange}
        ></ProductList>
    );
}

export default SearchResults;