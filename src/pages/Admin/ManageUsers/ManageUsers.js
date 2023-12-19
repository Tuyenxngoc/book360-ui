import { useEffect, useState } from "react";
import { getAllCustomer } from "~/services/customerService";
import TableUsers from "./TableUsers";

import Style from './ManageUsers.module.scss';
import classNames from 'classnames/bind';
import { Link } from "react-router-dom";
import { Button, TablePagination } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Input } from 'antd';
const { Search } = Input;

const cx = classNames.bind(Style);

function ManageUsers() {

    const [meta, setMeta] = useState({});
    const [dataUsers, setDataUsers] = useState([]);

    const fetchListUser = () => {
        getAllCustomer()
            .then((response) => {
                const { items, meta } = response.data.data;
                setDataUsers(items)
                setMeta(meta);
            })
            .catch((error) => { console.log(error) });
    }

    useEffect(() => {
        fetchListUser();
    }, [])

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onSearch = (value, _e, info) => console.log(info?.source, value);

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
                                            placeholder="Nhập tên cần tìm"
                                            allowClear
                                        />
                                        <Button size='small' variant='contained'>Tìm kiếm</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='content'>
                            <TableUsers listUsers={dataUsers} fetchListUser={fetchListUser} />
                            <TablePagination
                                className={cx('table-pagination')}
                                component="div"
                                count={dataUsers.length}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;