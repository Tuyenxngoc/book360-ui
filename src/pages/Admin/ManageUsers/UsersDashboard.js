import { useEffect, useState } from 'react';
import { getAllCustomer } from '~/services/customerService';

import Style from './ManageUsers.module.scss';
import classNames from 'classnames/bind';
import { Button, TablePagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Input } from 'antd';
import queryString from 'query-string';
import TableUsers from './TableUsers';
import { useNavigate } from 'react-router-dom';
import { routes } from '~/config';

const cx = classNames.bind(Style);

const defaultValue = {
    keyword: '',
    sortBy: 'createdDate',
    isAscending: false,
    pageNum: 0,
    pageSize: 10,
}

function UsersDashboard() {

    const navigate = useNavigate();
    const [dataUsers, setDataUsers] = useState([]);
    const [meta, setMeta] = useState({});
    const [filters, setFilters] = useState(defaultValue);

    const handleSearch = () => {
        fetchListUser();
    };

    const fetchListUser = () => {
        const paramsString = queryString.stringify(filters);
        getAllCustomer(paramsString)
            .then((response) => {
                const { items, meta } = response.data.data;
                setDataUsers(items);
                setMeta(meta);
            })
            .catch((error) => { console.log(error) });
    }

    useEffect(() => {
        fetchListUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleCreateUser = () => {
        navigate(routes.createUser);
    }
    const handleChangePage = (event, newPage) => {
        setFilters({ ...filters, pageNum: newPage });
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ ...filters, pageNum: 0, pageSize: parseInt(event.target.value, 10) })
    };

    return (
        <div className='container my-3'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className={cx('list-main')}>
                        <div className={cx('header')}>
                            <div className={cx('title')}>{dataUsers.length} Khách hàng</div>
                            <Button
                                size='small'
                                variant='contained'
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={handleCreateUser}
                            >
                                Thêm mới
                            </Button>
                        </div>

                        <div className={cx('users-filter-card')}>
                            <div className='row gy-3'>
                                <div className='col-12'>
                                    <div className={cx('search-section')}>
                                        <Input
                                            placeholder='Nhập tên cần tìm'
                                            allowClear
                                            value={filters.keyword}
                                            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                        />
                                        <Button size='small' variant='contained' onClick={handleSearch}>Tìm kiếm</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='content'>
                            <TableUsers listUsers={dataUsers} fetchListUser={fetchListUser} />
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

export default UsersDashboard;