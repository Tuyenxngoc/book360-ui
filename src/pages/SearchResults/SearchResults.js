import { useState, useEffect } from 'react';
import Style from './SearchResults.module.scss'
import classNames from 'classnames/bind';
import Product from '~/components/Product';
import request from '~/utils/request';
import Pagination from '~/components/Pagination';
import queryString from 'query-string';
import PropTypes from 'prop-types';

const cx = classNames.bind(Style);

function SearchResults({ keyword = '', sortBy = '', isAscending = false }) {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        keyword: keyword,
        sortBy: sortBy,
        isAscending: isAscending,
        pageNum: 1,
        pageSize: 10,
    })

    useEffect(() => {
        const paramsString = queryString.stringify(filters);
        request
            .get(`product/get-products?${paramsString}`)
            .then((response) => { setData(response.data.data) })
            .catch((error) => console.error(error));
    }, [filters]);

    // Xử lý sự kiện thay đổi trang
    const handlePageChange = (pageNumber) => {
        setFilters({ ...filters, pageNum: pageNumber })
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-2'>
                </div>
                <div className='col'>
                    <div className='row mb-4'>
                        {data.items && data.items.map((product) => (
                            <div key={product.productID} className="col-2-4 mb-4">
                                <Product data={product} ></Product>
                            </div>
                        ))}
                    </div>
                    <div className='row'>
                        {data.meta && <Pagination pagination={data.meta} onPageChange={handlePageChange} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

SearchResults.propTypes = {
    keyword: PropTypes.string,
    sortBy: PropTypes.string,
    isAscending: PropTypes.bool
}

export default SearchResults;