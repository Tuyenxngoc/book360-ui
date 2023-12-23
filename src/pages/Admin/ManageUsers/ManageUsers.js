import { useEffect, useState } from 'react';
import { getAllCustomer } from '~/services/customerService';

import Style from './ManageUsers.module.scss';
import classNames from 'classnames/bind';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Input } from 'antd';
import EnhancedTable from './test';
import queryString from 'query-string';

const cx = classNames.bind(Style);

function ManageUsers() {

    const [meta, setMeta] = useState({});
    const [dataUsers, setDataUsers] = useState([]);
    const [filters, setFilters] = useState({
        keyword: '',
        sortBy: 'createdDate',
        isAscending: false,
        pageNum: 0,
        pageSize: 10,
    })

    const fetchListUser = () => {
        const paramsString = queryString.stringify(filters);
        getAllCustomer(paramsString)
            .then((response) => {
                const { items, meta } = response.data.data;
                setDataUsers(items)
                setMeta(meta);
            })
            .catch((error) => { console.log(error) });
    }

    useEffect(() => {
        fetchListUser();
    }, [filters])

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
                                        />
                                        <Button size='small' variant='contained'>Tìm kiếm</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='content'>
                            <EnhancedTable
                                listUsers={dataUsers}
                                filters={filters}
                                setFilters={setFilters}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;