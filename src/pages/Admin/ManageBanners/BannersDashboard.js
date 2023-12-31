import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TablePagination } from "@mui/material";

import TableBanners from "./TableBanners";

import Style from './ManageBanners.module.scss';
import classNames from 'classnames/bind';

import { getAllBanners } from "~/services/bannerService";
import { routes } from "~/config";
import queryString from "query-string";

const cx = classNames.bind(Style);

function BannersDashboard() {

    const navigate = useNavigate();
    const [meta, setMeta] = useState({});
    const [dataBanners, setDataBanners] = useState([]);
    const [filters, setFilters] = useState({
        keyword: '',
        sortBy: '',
        isAscending: false,
        pageNum: 0,
        pageSize: 10,
    })

    const fetchListBanner = () => {
        const paramsString = queryString.stringify({ ...filters, pageNum: filters.pageNum + 1 });
        getAllBanners(paramsString)
            .then((response) => {
                const { items, meta } = response.data.data;
                setDataBanners(items);
                setMeta(meta);
            })
            .catch((error) => { console.log(error) })
    }

    useEffect(() => {
        fetchListBanner();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters])

    const handleChangePage = (event, newPage) => {
        setFilters({ ...filters, pageNum: newPage });
    };

    const handleChangeRowsPerPage = (event) => {
        setFilters({ ...filters, pageNum: 0, pageSize: parseInt(event.target.value, 10) })
    };

    const handleCreateBanner = () => {
        navigate(routes.createBanner);
    };

    return (
        <div className='container my-3'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className={cx('list-main')}>
                        <div className={cx('header')}>
                            <div className={cx('title')}>{dataBanners.length} Banners</div>
                            <Button
                                size='small'
                                variant='contained'
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={handleCreateBanner}
                            >
                                Thêm mới
                            </Button>
                        </div>
                        <div className='content'>
                            <TableBanners listBanners={dataBanners} fetchListBanner={fetchListBanner} />
                            <TablePagination
                                className={cx('table-pagination')}
                                component="div"
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

export default BannersDashboard;