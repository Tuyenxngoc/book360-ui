import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, TablePagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import queryString from 'query-string';

import { getAllProducts } from '~/services/productService';

import TableProducts from './TableProducts';
import SortProduct from '~/components/SortProduct';

import Style from './ManageProducts.module.scss';
import classNames from 'classnames/bind';
import { routes } from '~/config';

const cx = classNames.bind(Style);

function ManageProducts() {
    const navigate = useNavigate();
    const [dataProducts, setDataProducts] = useState([]);
    const [meta, setMeta] = useState({});

    const [filters, setFilters] = useState({
        keyword: '',
        sortBy: 'createdDate',
        isAscending: false,
        pageNum: 0,
        pageSize: 10,
    })

    const handleChangePage = (event, newPage) => {
        setFilters({ ...filters, pageNum: newPage });
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ ...filters, pageNum: 0, pageSize: parseInt(event.target.value, 10) })
    };

    const handleSortChange = (newSortBy, newIsAscending = false) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sortBy: newSortBy,
            isAscending: newIsAscending,
        }));
    };

    const fetchListProduct = () => {
        const paramsString = queryString.stringify({ ...filters, pageNum: filters.pageNum + 1 });
        getAllProducts(paramsString)
            .then((response) => {
                const { items, meta } = response.data.data;
                setDataProducts(items);
                setMeta(meta);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        fetchListProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    return (
        <div className='container my-3'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className={cx('product-filter-card')}>
                        <form>
                            <div className='filter-form-box'>
                                <div className='row'>
                                    <div className='col-6'>
                                        <div className={cx('form-group')}>
                                            <label className={cx('form-label')} htmlFor='inputName'>Tên sản phẩm</label>
                                            <div className={cx('form-input')}>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    id='inputName'
                                                    name='name'
                                                    placeholder='Vui lòng nhập vào'
                                                />
                                            </div>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label className={cx('form-label')} htmlFor='inputQuantityMin'>Kho hàng</label>
                                            <div className={cx('form-input')}>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    id='inputQuantityMin'
                                                    name='quantityMin'
                                                    placeholder='Tối thiểu'
                                                />
                                                <span className={cx('interim-line')}>-</span>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    id='inputQuantityMax'
                                                    name='quantityMax'
                                                    placeholder='Tối đa'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-6'>
                                        <div className={cx('form-group')}>
                                            <label className={cx('form-label')} htmlFor='inputCategory'>Danh mục</label>
                                            <div className={cx('form-input')}>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    id='inputCategory'
                                                    name='category'
                                                    placeholder='Vui lòng nhập vào'
                                                />
                                            </div>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label className={cx('form-label')} htmlFor='inputSoldMin'>Doanh số</label>
                                            <div className={cx('form-input')}>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    id='inputSoldMin'
                                                    name='soldMin'
                                                    placeholder='Tối thiểu'
                                                />
                                                <span className={cx('interim-line')}>-</span>
                                                <input
                                                    type='text'
                                                    className='form-control'
                                                    id='inputSoldMax'
                                                    name='soldMax'
                                                    placeholder='Tối đa'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='actions'>
                                <Button size='small' type='submit' variant='contained'>Tìm</Button>
                                <Button size='small' type='reset' variant='outlined' sx={{ ml: 2 }}>Nhập lại</Button>
                            </div>
                        </form>
                    </div>

                    <div className={cx('product-list-main')}>
                        <div className={cx('header')}>
                            <SortProduct handleSortChange={handleSortChange} filters={filters}></SortProduct>
                            <Button
                                size='small'
                                variant='contained'
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={() => {
                                    navigate(routes.createProduct);
                                }}
                            >
                                Thêm mới
                            </Button>
                        </div>
                        <div className='content'>
                            <TableProducts listProduct={dataProducts} fetchListProduct={fetchListProduct} />
                            <TablePagination
                                className={cx('table-pagination')}
                                component='div'
                                count={meta.totalElements || 100}
                                page={filters.pageNum}
                                onPageChange={handleChangePage}
                                rowsPerPage={meta.pageSize || 10}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageProducts;