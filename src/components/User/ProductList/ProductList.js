import Breadcrumb from "~/components/Common/Breadcrumb";
import SortProduct from "~/components/Common/SortProduct";
import Pagination from "~/components/Common/Pagination";
import Product from "~/components/Common/Product/Product";

import PropTypes from 'prop-types'

function ProductList({
    currentPage,// tên page hiện tại
    products, // list products để render
    pagination,// thông tin về phân trang
    filters,// thông tin về sắp xếp
    handleSortChange,// sử lý sự kiện xắp xếp
    handlePageChange // sử lý sự kiện chuyển trang
}) {

    if (!(products && pagination)) {
        return <h2 className="text-center">Đang load dữ liệu</h2>
    } else if (pagination.totalElements === 0) {
        return <h2 className="text-center">Không tìm thấy sản phẩm nào</h2>
    }

    return (
        <>
            <Breadcrumb currentPage={currentPage} />
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div>{`Tìm thấy ${pagination.totalElements} sản phẩm`}</div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-2'>
                        {/* tùy chọn... */}
                    </div>
                    {/* products */}
                    <div className='col-10'>
                        <div className="row">
                            <div className="row mb-4">
                                <div className="col">
                                    <SortProduct handleSortChange={handleSortChange} filters={filters}></SortProduct>
                                </div>
                            </div>
                            <div className='row mb-4'>
                                {products.map((product) => (
                                    <div key={product.productId} className="col-2-4 mb-4">
                                        <Product data={product} ></Product>
                                    </div>
                                ))}
                            </div>
                            <div className='row'>
                                <div className="col">
                                    {<Pagination pagination={pagination} onPageChange={handlePageChange} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ProductList.propTypes = {
    currentPage: PropTypes.string.isRequired,
    products: PropTypes.array,
    pagination: PropTypes.object,
    filters: PropTypes.object.isRequired,
    handleSortChange: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
}

export default ProductList;