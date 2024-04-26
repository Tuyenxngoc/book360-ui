import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, TablePagination } from '@mui/material';

import TableBanners from './TableBanners';

import Style from './ManageBanners.module.scss';
import classNames from 'classnames/bind';

import { getBanners } from '~/services/bannerService';
import { routes } from '~/config';
import queryString from 'query-string';
import { toast } from 'react-toastify';

const cx = classNames.bind(Style);

function BannersDashboard() {
    const navigate = useNavigate();
    const [meta, setMeta] = useState({});
    const [dataBanners, setDataBanners] = useState([]);
    const [filters, setFilters] = useState({
        keyword: '',
        sortBy: '',
        isAscending: false,
        pageNum: 1,
        pageSize: 10,
    });

    const fetchListBanner = () => {
        const params = queryString.stringify(filters);
        getBanners(params)
            .then((response) => {
                const { items, meta } = response.data.data;
                setDataBanners(items);
                setMeta(meta);
            })
            .catch((error) => {
                toast.error('Đã có lỗi xảy ra khi lấy dữ liệu banner');
            });
    };

    useEffect(() => {
        fetchListBanner();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    const handleChangePage = (_, newPage) => {
        setFilters({ ...filters, pageNum: newPage + 1 });
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ ...filters, pageNum: 1, pageSize: parseInt(event.target.value, 10) });
    };

    const handleCreateBanner = () => {
        navigate(routes.createBanner);
    };

    return (
        <div className="container my-3">
            <div className="row justify-content-center">
                <div className="col-10">
                    <div className={cx('list-main')}>
                        <div className={cx('header')}>
                            <div className={cx('title')}>{dataBanners.length} Banners</div>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={handleCreateBanner}
                            >
                                Thêm mới
                            </Button>
                        </div>
                        <div className="content">
                            <TableBanners listBanners={dataBanners} fetchListBanner={fetchListBanner} />
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

export default BannersDashboard;
