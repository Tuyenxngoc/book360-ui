import React, { useState, useEffect } from 'react';
import request from '~/utils/request';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import ProductList from '~/components/ProductList';
import { useLocation } from 'react-router-dom';

function SearchResults({ sortBy = 'createdDate', isAscending = false }) {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const keyword = queryParams.keyword || '';

    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        sortBy: sortBy,
        isAscending: isAscending,
        pageNum: 1,
        pageSize: 10,
    })

    useEffect(() => {
        const paramsString = queryString.stringify({ ...filters, keyword });
        request
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

SearchResults.propTypes = {
    sortBy: PropTypes.string,
    isAscending: PropTypes.bool
}

export default SearchResults;