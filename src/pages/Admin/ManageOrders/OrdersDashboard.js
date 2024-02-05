import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatePicker, Input, Select, Space, Tabs } from 'antd';
import { Button, TablePagination } from '@mui/material';
import { billStatus } from '~/config/contans';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import TableOrders from './TableOrders';
import queryString from 'query-string';
import Style from './MagageOrders.module.scss';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const dateF = 'YYYY-MM-DD';

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
        value: 'productName',
        label: 'Tên sản phẩm',
    },
];

const defaultFilters = {
    keyword: '',
    searchBy: '',
    sortBy: 'createdDate',
    isAscending: false,
    pageNum: 1,
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

function OrdersDashboard() {

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
            navigate('/admin/order');
        } else {
            navigate(`/admin/order?type=${activeKey}`);
        }
    };

    useEffect(() => {
        setType(queryParams.type || '');
    }, [queryParams]);

    const handleSelectChange = (value, option) => {
        setTypeSearch(option.label);
    };

    const handleChangePage = (event, newPage) => {
        setFilters({ ...filters, pageNum: newPage });
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ ...filters, pageNum: 1, pageSize: parseInt(event.target.value, 10) })
    };

    const fetchListOrder = () => {
        const params = queryString.stringify({ ...filters, pageNum: filters.pageNum, billStatus: type });
        // getAllBills(params)
        //     .then((response) => {
        //         const { items, meta } = response.data.data;
        //         setMeta(meta);
        //         setDataOrders(items);
        //     })
        //     .catch((error) => {
        //         toast.error('Đã có lỗi xảy ra khi lấy dữ liệu đơn hàng');
        //     })
    }

    useEffect(() => {
        fetchListOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, type]);

    const handleGetStatistic = () => {
        const params = queryString.stringify({
            timeStart: defaultDateRange.start,
            timeEnd: defaultDateRange.end,
        });
        // getStatistic(params)
        //     .then((response) => {
        //         const formattedStart = defaultDateRange.start.replace(/-/g, '');
        //         const formattedEnd = defaultDateRange.end.replace(/-/g, '');
        //         const filename = `Order.all.${formattedStart}_${formattedEnd}.xlsx`;

        //         saveAs(response.data, filename);
        //     })
        //     .catch((error) => {
        //         toast.error('Đã có lỗi xảy ra khi lấy dữ liệu đơn hàng');
        //     })
    }

    const handleDateRangeChange = (dates) => {
        defaultDateRange.start = dates[0].format(dateF);
        defaultDateRange.end = dates[1].format(dateF);
    };

    return (
        <div className='container my-3'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className={cx('order-list-main')}>
                        <div className={cx('order-list-tab')}>
                            <Tabs
                                activeKey={type}
                                items={billStatus}
                                onChange={handleChangeOrderStatus}
                                size='large'
                            />
                        </div>
                        <div className={cx('order-filter-card')}>
                            <div className='row gy-3'>
                                <div className='col-12'>
                                    <div className={cx('date-range-picker')}>
                                        <div className='me-2'>Ngày đặt hàng</div>
                                        <RangePicker
                                            onChange={handleDateRangeChange}
                                            defaultValue={[dayjs(defaultDateRange.start, dateFormat), dayjs(defaultDateRange.end, dateFormat)]}
                                            format={dateFormat}
                                        />
                                        <Button
                                            variant='outlined'
                                            size='small'
                                            color='primary'
                                            sx={{ ml: 1 }}
                                            onClick={handleGetStatistic}
                                        >
                                            Xuất
                                        </Button>
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <div className={cx('search-section')}>
                                        <Space.Compact style={{ flex: 1 }}>
                                            <Select defaultValue='Mã đơn hàng' onChange={handleSelectChange} options={options} style={{ minWidth: '190px' }} />
                                            <Input allowClear={true} placeholder={`Nhập ${typeSearch}`} />
                                        </Space.Compact>
                                        <Button variant='contained' size='small' sx={{ mx: 1 }} color='primary'>Tìm kiếm</Button>
                                        <Button variant='outlined' size='small' color='primary'>Đặt lại</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cx('order-list-panel')}>
                            <div className={cx('header')}>
                                <div className={cx('title')}>{dataOrders.length} Đơn hàng</div>
                            </div>
                            <div className='content'>
                                <TableOrders listOrder={dataOrders} fetchListOrder={fetchListOrder} />
                                <TablePagination
                                    className={cx('table-pagination')}
                                    component='div'
                                    count={meta.totalElements || 100}
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
        </div>
    );
}

export default OrdersDashboard;