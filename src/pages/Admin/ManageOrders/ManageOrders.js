import { faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, TablePagination } from '@mui/material';
import TableOrders from './TableOrders';
import { useEffect, useMemo, useState } from 'react';
import { getAllBills } from '~/services/billService';
import queryString from 'query-string';

import Style from './MagageOrders.module.scss';
import classNames from 'classnames/bind';

import { useLocation, useNavigate } from 'react-router-dom';
import { ConfigProvider, DatePicker, Input, Select, Space, Tabs } from 'antd';

import viVN from 'antd/lib/locale/vi_VN';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';

const cx = classNames.bind(Style);

const options = [
    {
        value: 'billId',
        label: 'Mã đơn hàng',
    },
    {
        value: 'nameCustomer',
        label: 'Tên người mua',
    },
    {
        value: 'product',
        label: 'Sản phẩm',
    },
];

const orderStatus = [
    {
        label: 'Tất cả',
        key: '',
    },
    {
        label: 'Chờ xử lý',
        key: 'unpaid',
    },
    {
        label: 'Đang giao hàng',
        key: 'shipping',
    },
    {
        label: 'Đặt hàng thành công',
        key: 'success',
    },
    {
        label: 'Đã giao',
        key: 'completed',
    },
    {
        label: 'Đã hủy',
        key: 'cancelled',
    },
];

const defaultFilters = {
    keyword: '',
    sortBy: 'createdDate',
    isAscending: false,
    pageNum: 0,
    pageSize: 10,
}

const getDateRange = () => {
    const currentDate = new Date();
    const pastMonthDate = new Date();
    pastMonthDate.setMonth(pastMonthDate.getMonth() - 1);
    const currentDateString = currentDate.toISOString().slice(0, 10);
    const pastMonthDateString = pastMonthDate.toISOString().slice(0, 10);
    return {
        start: pastMonthDateString,
        end: currentDateString
    };
};

function ManageOrders() {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = queryString.parse(location.search);
    const [type, setType] = useState(queryParams.type || '');

    const [dataOrders, setDataOrders] = useState([]);
    const [meta, setMeta] = useState({});
    const [filters, setFilters] = useState(defaultFilters)

    const [typeSearch, setTypeSearch] = useState(options[0].label);
    const defaultDateRange = useMemo(getDateRange, []);

    const handleChangeOrderStatus = (activeKey) => {
        setType(activeKey);
        if (activeKey === '') {
            navigate('/admin/orders');
        } else {
            navigate(`/admin/orders?type=${activeKey}`);
        }
    };

    const handleSelectChange = (value, option) => {
        setTypeSearch(option.label);
    };

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

    const fetchListOrder = () => {
        const paramsString = queryString.stringify({ ...filters, pageNum: filters.pageNum + 1, status: type });
        getAllBills(paramsString)
            .then((response) => {
                const { items, meta } = response.data.data;
                setMeta(meta);
                setDataOrders(items);
            })
            .catch((error) => { console.log(error) })
    }

    useEffect(() => {
        fetchListOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, type])

    return (
        <div className='container my-3'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className={cx('order-list-main')}>
                        <div className={cx('order-list-tab')}>
                            <Tabs
                                defaultActiveKey={type}
                                items={orderStatus}
                                onChange={handleChangeOrderStatus}
                                size='large'
                            />
                        </div>
                        <div className={cx('order-filter-card')}>
                            <div className='row gy-3'>
                                <div className='col-12'>
                                    <div className={cx('date-range-picker')}>
                                        <div className='me-2'>Ngày đặt hàng</div>
                                        <ConfigProvider locale={viVN}>
                                            <RangePicker
                                                defaultValue={[dayjs(defaultDateRange.start, dateFormat), dayjs(defaultDateRange.end, dateFormat)]}
                                                format={dateFormat}
                                            />
                                        </ConfigProvider>
                                        <Button variant='outlined' size='small' sx={{ ml: 1 }} color='primary'>Xuất</Button>
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <div className={cx('search-section')}>
                                        <ConfigProvider locale={viVN}>
                                            <Space.Compact style={{ flex: 1 }}>
                                                <Select defaultValue='Mã đơn hàng' onChange={handleSelectChange} options={options} style={{ minWidth: '190px' }} />
                                                <Input allowClear={true} placeholder={`Nhập ${typeSearch}`} />
                                            </Space.Compact>
                                        </ConfigProvider>
                                        <Button variant='contained' size='small' sx={{ mx: 1 }} color='primary'>Tìm kiếm</Button>
                                        <Button variant='outlined' size='small' color='primary'>Đặt lại</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cx('order-list-panel')}>
                            <div className={cx('header')}>
                                <div className={cx('title')}>{dataOrders.length} Đơn hàng</div>
                                <Button size='small' startIcon={<FontAwesomeIcon icon={faTruck} />} variant='contained'>Giao hàng loạt</Button>
                            </div>
                            <div className='content'>
                                <TableOrders listOrder={dataOrders} fetchListOrder={fetchListOrder} />
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
        </div>

    );
}

export default ManageOrders;