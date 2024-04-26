import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, TablePagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Style from './ManageBookSets.module.scss';
import classNames from 'classnames/bind';

import TableBookSets from './TableBookSets';
import { routes } from '~/config';
import { toast } from 'react-toastify';
import queryString from 'query-string';
import { getBookSets } from '~/services/bookSetService';

const cx = classNames.bind(Style);

function BookSetsDashboard() {
    const navigate = useNavigate();
    const [dataBookSets, setDataBookSets] = useState([]);
    const [meta, setMeta] = useState({});

    const [filters, setFilters] = useState({
        keyword: '',
        searchBy: '',
        sortBy: 'createdDate',
        isAscending: false,
        pageNum: 1,
        pageSize: 10,
    });

    const fetchListBookSet = () => {
        const params = queryString.stringify(filters);
        getBookSets(params)
            .then((response) => {
                const { items, meta } = response.data.data;
                setDataBookSets(items);
                setMeta(meta);
            })
            .catch(() => {
                toast.error('Đã có lỗi xảy ra khi lấy dữ liệu bộ sách');
            });
    };

    useEffect(() => {
        fetchListBookSet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleCreateBookSet = () => {
        navigate(routes.createBookSet);
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
                            <div className={cx('title')}>{dataBookSets.length} Bộ sách</div>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={handleCreateBookSet}
                            >
                                Thêm mới
                            </Button>
                        </div>
                        <div className="content">
                            <TableBookSets listBookSet={dataBookSets} fetchListBookSet={fetchListBookSet} />
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

export default BookSetsDashboard;
