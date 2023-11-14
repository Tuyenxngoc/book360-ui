import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "~/components/Breadcrumb";
import Pagination from "~/components/Pagination";
import Product from "~/components/Product";
import request from "~/utils/request";
import Style from './Category.module.scss';
import classNames from "classnames/bind";
import queryString from "query-string";
import SortProduct from "~/components/SortProduct";

const cx = classNames.bind(Style);

function Category({ keyword = '', sortBy = 'createdDate', isAscending = false }) {
    const { id } = useParams();
    console.log(id);
    const [data, setData] = useState({});
    const [filters, setFilters] = useState({
        keyword: keyword,
        sortBy: sortBy,
        isAscending: isAscending,
        pageNum: 1,
        pageSize: 10,
    })

    useEffect(() => {
        console.log(filters);
        const paramsString = queryString.stringify(filters);
        request
            .get(`product/get-products-by-categoryId/${id}/?${paramsString}`)
            .then((response) => { setData(response.data.data) })
            .catch((error) => console.error(error));
    }, [filters, id]);

    // Xử lý sự kiện thay đổi trang
    const handlePageChange = (pageNumber) => {
        setFilters({ ...filters, pageNum: pageNumber })
    };

    const handleSortChange = (newSortBy, newIsAscending = false) => {
        setFilters({
            ...filters,
            sortBy: newSortBy,
            isAscending: newIsAscending,
        });
    };

    return (
        <>
            <Breadcrumb currentPage={'Danh mục'}></Breadcrumb>
            <div className="container">
                <div className='row'>
                    <div className='col-2'>
                    </div>
                    <div className='col-10'>
                        <div className="row">
                            <div className="row mb-4">
                                <div class="col">
                                    <SortProduct handleSortChange={handleSortChange} filters={filters}></SortProduct>
                                </div>
                            </div>
                            <div className='row mb-4'>
                                {data.items && data.items.map((product) => (
                                    <div key={product.productID} className="col-2-4 mb-4">
                                        <Product data={product} ></Product>
                                    </div>
                                ))}
                            </div>
                            <div className='row'>
                                <div class="col">
                                    {data.meta && <Pagination pagination={data.meta} onPageChange={handlePageChange} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Category;