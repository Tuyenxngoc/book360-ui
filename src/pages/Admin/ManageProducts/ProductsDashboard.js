import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, FormHelperText, TablePagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import queryString from 'query-string';

import { getProductsForAdmin } from '~/services/productService';

import TableProducts from './TableProducts';
import SortProduct from '~/components/Common/SortProduct';

import Style from './ManageProducts.module.scss';
import classNames from 'classnames/bind';
import { routes } from '~/config';
import { toast } from 'react-toastify';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { Input, Select, Space } from 'antd';
import { getAllCategories } from '~/services/categoryService';

const cx = classNames.bind(Style);

function inputProps(isError) {
    if (isError) {
        return {
            status: 'error',
        };
    }
}

const options = [
    {
        value: 'name',
        label: 'Tên sản phẩm',
    },
    {
        value: 'price',
        label: 'Giá sản phẩm',
    },
    {
        value: 'discount',
        label: 'Giảm giá',
    },
    {
        value: 'isbn',
        label: 'Mã số sách quốc tế',
    },
    {
        value: 'publisher',
        label: 'Nhà xuất bản',
    },
    {
        value: 'language',
        label: 'Ngôn ngữ',
    },
    {
        value: 'format',
        label: 'Định dạng bìa',
    },
    {
        value: 'size',
        label: 'Kích thước',
    },
];

const defaultValue = {
    keyword: '',
    searchBy: options[0].value,
    sellerStockMax: '',
    sellerStockMin: '',
    soldMax: '',
    soldMin: '',
    categoryId: null,
};

const validationSchema = yup.object().shape({
    keyword: yup.string(),
    searchBy: yup.string(),

    sellerStockMin: yup
        .number()
        .typeError('Số lượng tối thiểu phải là một số')
        .integer('Số lượng sản phẩm phải là số nguyên'),

    sellerStockMax: yup
        .number()
        .typeError('Số lượng tối đa phải là một số')
        .integer('Số lượng sản phẩm phải là số nguyên')
        .when('sellerStockMin', (sellerStockMin, schema) => {
            return sellerStockMin
                ? schema.min(sellerStockMin, 'Số lượng tối đa phải lớn hơn hoặc bằng Số lượng tối thiểu')
                : schema;
        }),

    soldMin: yup.number().typeError('Doanh số tối thiểu phải là một số').integer('Doanh số sản phẩm phải là số nguyên'),

    soldMax: yup
        .number()
        .typeError('Doanh số tối đa phải là một số')
        .integer('Doanh số sản phẩm phải là số nguyên')
        .when('soldMin', (soldMin, schema) => {
            return soldMin ? schema.min(soldMin, 'Doanh số tối đa phải lớn hơn hoặc bằng Doanh số tối thiểu') : schema;
        }),
});

function ProductsDashboard() {
    const navigate = useNavigate();
    const [dataProducts, setDataProducts] = useState([]);
    const [meta, setMeta] = useState({});
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        sortBy: 'createdDate',
        isAscending: false,
        pageNum: 1,
        pageSize: 10,
    });

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: () => {
            fetchListProduct();
        },
    });

    const handleChangePage = (_, newPage) => {
        setFilters({ ...filters, pageNum: newPage + 1 });
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ ...filters, pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    const handleSortChange = (sortBy = 'createdDate', isAscending = false) => {
        setFilters({ ...filters, sortBy, isAscending });
    };

    const handleResetValues = () => {
        formik.handleReset();
    };

    const fetchListProduct = () => {
        const params = queryString.stringify({ ...formik.values, ...filters });
        getProductsForAdmin(params)
            .then((response) => {
                const { items, meta } = response.data.data;
                setDataProducts(items);
                setMeta(meta);
            })
            .catch((error) => {
                toast.error('Đã có lỗi xảy ra khi lấy dữ liệu sản phẩm');
            });
    };

    useEffect(() => {
        fetchListProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    useEffect(() => {
        getAllCategories()
            .then((response) => {
                setCategories(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className="container my-3">
            <div className="row justify-content-center">
                <div className="col-10">
                    <div className={cx('product-filter-card')}>
                        <form>
                            <div className="filter-form-box">
                                <div className="row">
                                    <div className="col-6">
                                        <div className={cx('form-group')}>
                                            <div className={cx('form-input')}>
                                                <Space.Compact style={{ flex: 1 }}>
                                                    <Select
                                                        id="searchBy"
                                                        name="searchBy"
                                                        placeholder="Vui lòng chọn"
                                                        style={{ minWidth: '190px' }}
                                                        value={formik.values.searchBy}
                                                        onChange={(value) => formik.setFieldValue('searchBy', value)}
                                                        onBlur={formik.handleBlur}
                                                        options={options}
                                                        {...inputProps(
                                                            formik.touched.searchBy && Boolean(formik.errors.searchBy),
                                                        )}
                                                    />
                                                    <Input
                                                        allowClear
                                                        size="small"
                                                        id="inputKeyword"
                                                        name="keyword"
                                                        placeholder="Vui lòng nhập vào"
                                                        value={formik.values.keyword}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        {...inputProps(
                                                            formik.touched.keyword && Boolean(formik.errors.keyword),
                                                        )}
                                                    />
                                                </Space.Compact>
                                            </div>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label className={cx('form-label')} htmlFor="inputQuantityMin">
                                                Kho hàng
                                            </label>
                                            <div style={{ width: '100%' }}>
                                                <div className={cx('form-input')}>
                                                    <Input
                                                        allowClear
                                                        size="small"
                                                        id="inputQuantityMin"
                                                        name="sellerStockMin"
                                                        placeholder="Tối thiểu"
                                                        value={formik.values.sellerStockMin}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        {...inputProps(
                                                            formik.touched.sellerStockMin &&
                                                                Boolean(formik.errors.sellerStockMin),
                                                        )}
                                                    />
                                                    <span className={cx('interim-line')}>-</span>
                                                    <Input
                                                        allowClear
                                                        size="small"
                                                        id="inputQuantityMax"
                                                        name="sellerStockMax"
                                                        placeholder="Tối đa"
                                                        value={formik.values.sellerStockMax}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        {...inputProps(
                                                            formik.touched.sellerStockMax &&
                                                                Boolean(formik.errors.sellerStockMax),
                                                        )}
                                                    />
                                                </div>
                                                {formik.touched.sellerStockMin && formik.errors.sellerStockMin && (
                                                    <FormHelperText error>
                                                        {formik.errors.sellerStockMin}
                                                    </FormHelperText>
                                                )}
                                                {formik.touched.sellerStockMax && formik.errors.sellerStockMax && (
                                                    <FormHelperText error>
                                                        {formik.errors.sellerStockMax}
                                                    </FormHelperText>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className={cx('form-group')}>
                                            <label className={cx('form-label')} htmlFor="categoryId">
                                                Danh mục
                                            </label>
                                            <div className={cx('form-input')}>
                                                <Select
                                                    allowClear
                                                    id="categoryId"
                                                    name="categoryId"
                                                    placeholder="Vui lòng chọn"
                                                    style={{ width: '100%' }}
                                                    value={formik.values.categoryId}
                                                    onChange={(value) => formik.setFieldValue('categoryId', value)}
                                                    onBlur={formik.handleBlur}
                                                    options={categories.map((category) => ({
                                                        value: category.id,
                                                        label: category.name,
                                                    }))}
                                                    {...inputProps(
                                                        formik.touched.categoryId && Boolean(formik.errors.categoryId),
                                                    )}
                                                />
                                                {formik.touched.categoryId && formik.errors.categoryId && (
                                                    <FormHelperText error>{formik.errors.categoryId}</FormHelperText>
                                                )}
                                            </div>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label className={cx('form-label')} htmlFor="inputSoldMin">
                                                Doanh số
                                            </label>
                                            <div style={{ width: '100%' }}>
                                                <div className={cx('form-input')}>
                                                    <Input
                                                        allowClear
                                                        size="small"
                                                        id="inputSoldMin"
                                                        name="soldMin"
                                                        placeholder="Tối thiểu"
                                                        value={formik.values.soldMin}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        {...inputProps(
                                                            formik.touched.soldMin && Boolean(formik.errors.soldMin),
                                                        )}
                                                    />
                                                    <span className={cx('interim-line')}>-</span>
                                                    <Input
                                                        allowClear
                                                        size="small"
                                                        id="inputSoldMax"
                                                        name="soldMax"
                                                        placeholder="Tối đa"
                                                        value={formik.values.soldMax}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        {...inputProps(
                                                            formik.touched.soldMax && Boolean(formik.errors.soldMax),
                                                        )}
                                                    />
                                                </div>
                                                {formik.touched.soldMin && formik.errors.soldMin && (
                                                    <FormHelperText error>{formik.errors.soldMin}</FormHelperText>
                                                )}
                                                {formik.touched.soldMax && formik.errors.soldMax && (
                                                    <FormHelperText error>{formik.errors.soldMax}</FormHelperText>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="actions">
                                <Button size="small" type="submit" variant="contained" onClick={formik.handleSubmit}>
                                    Tìm
                                </Button>
                                <Button
                                    size="small"
                                    type="reset"
                                    variant="outlined"
                                    sx={{ ml: 2 }}
                                    onClick={handleResetValues}
                                >
                                    Nhập lại
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className={cx('product-list-main')}>
                        <div className={cx('header')}>
                            <SortProduct handleSortChange={handleSortChange} filters={filters}></SortProduct>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={() => {
                                    navigate(routes.createProduct);
                                }}
                            >
                                Thêm mới
                            </Button>
                        </div>
                        <div className="content">
                            <TableProducts listProduct={dataProducts} fetchListProduct={fetchListProduct} />
                            <TablePagination
                                className={cx('table-pagination')}
                                component="div"
                                count={meta.totalElements || 1}
                                page={filters.pageNum - 1}
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

export default ProductsDashboard;
