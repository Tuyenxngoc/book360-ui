import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, TablePagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Style from './ManageAuthors.module.scss';
import classNames from 'classnames/bind';

import TableAuthors from './TableAuthors';
import { routes } from '~/config';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import { getAuthors } from '~/services/authorService';

const cx = classNames.bind(Style);

function AuthorsDashboard() {
    const navigate = useNavigate();
    const [dataAuthors, setDataAuthors] = useState([]);
    const [meta, setMeta] = useState({});

    const [filters, setFilters] = useState({
        keyword: '',
        searchBy: '',
        sortBy: 'createdDate',
        isAscending: false,
        pageNum: 1,
        pageSize: 10,
    });

    const fetchListAuthor = () => {
        const params = queryString.stringify(filters);
        getAuthors(params)
            .then((response) => {
                const { items, meta } = response.data.data;
                setDataAuthors(items);
                setMeta(meta);
            })
            .catch((error) => {
                toast.error('Đã có lỗi xảy ra khi lấy dữ liệu tác giả');
            });
    };

    useEffect(() => {
        fetchListAuthor();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleCreateAuthor = () => {
        navigate(routes.createAuthor);
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
                            <div className={cx('title')}>{dataAuthors.length} Tác giả</div>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={handleCreateAuthor}
                            >
                                Thêm mới
                            </Button>
                        </div>
                        <div className="content">
                            <TableAuthors listAuthor={dataAuthors} fetchListAuthor={fetchListAuthor} />
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

export default AuthorsDashboard;
