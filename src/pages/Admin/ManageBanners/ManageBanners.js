import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, TablePagination } from "@mui/material";
import TableBanners from "./TableBanners";

import Style from './ManageBanners.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from "react";
import { getAllBanners } from "~/services/bannerService";

const cx = classNames.bind(Style);

function ManageBanners() {

    const [dataBanners, setDataBanners] = useState([]);
    const [showDialogCreate, setShowDialogCreate] = useState(false);


    const fetchListBanner = () => {
        getAllBanners()
            .then((response) => { setDataBanners(response.data.data) })
            .catch((error) => { console.log(error) })
    }

    useEffect(() => {
        fetchListBanner();
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

    return (
        <div className='container my-3'>
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className={cx('list-main')}>
                        <div className={cx('header')}>
                            <div className={cx('title')}>{dataBanners.length} Banner</div>
                            <Button
                                size='small'
                                variant='contained'
                                startIcon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={() => { setShowDialogCreate(true); }}
                            >
                                Thêm mới
                            </Button>
                        </div>
                        <div className='content'>
                            <TableBanners listBanners={dataBanners} />
                            <TablePagination
                                className={cx('table-pagination')}
                                component="div"
                                count={dataBanners.length}
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

export default ManageBanners;