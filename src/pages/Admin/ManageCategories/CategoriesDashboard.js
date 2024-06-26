import { useEffect, useState } from 'react';

import { Button, TablePagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Style from './ManageCategories.module.scss';
import classNames from 'classnames/bind';

import { getCategoriesForAdmin } from '~/services/categoryService';
import TableCategories from './TableCategories';
import { useNavigate } from 'react-router-dom';
import { routes } from '~/config';
import { toast } from 'react-toastify';
import queryString from 'query-string';

const cx = classNames.bind(Style);

function CategoriesDashboard() {
    const navigate = useNavigate();
    const [dataCategories, setDataCategories] = useState([]);
    const [meta, setMeta] = useState({});

    const [filters, setFilters] = useState({
        keyword: '',
        searchBy: '',
        sortBy: 'createdDate',
        isAscending: false,
        pageNum: 1,
        pageSize: 10,
    });

    const fetchListCategory = () => {
        const params = queryString.stringify(filters);
        getCategoriesForAdmin(params)
            .then((response) => {
                const { items, meta } = response.data.data;
                setDataCategories(items);
                setMeta(meta);
            })
            .catch((error) => {
                toast.error('Đã có lỗi xảy ra khi lấy dữ liệu danh mục');
            });
    };

    useEffect(() => {
        fetchListCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleCreateCategory = () => {
        navigate(routes.createCategory);
    };

    const handleChangePage = (_, newPage) => {
        setFilters({ ...filters, pageNum: newPage + 1 });
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ ...filters, pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    return (
        <div className="container my-3">
            <div className="row justify-content-center">
                <div className="col-10">
                    <div className={cx('list-main')}>
                        <div className={cx('header')}>
                            <div className={cx('title')}>{dataCategories.length} Danh mục</div>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={handleCreateCategory}
                            >
                                Thêm mới
                            </Button>
                        </div>
                        <div className="content">
                            <TableCategories listCategory={dataCategories} fetchListCategory={fetchListCategory} />
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

export default CategoriesDashboard;
