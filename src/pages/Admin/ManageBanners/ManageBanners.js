import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import TableBanners from "./TableBanners";

import Style from './ManageBanners.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from "react";
import { getAllBanners } from "~/services/bannerService";

const cx = classNames.bind(Style);

function ManageBanners() {

    const [dataBanners, setDataBanners] = useState([]);

    const fetchListBanner = () => {
        getAllBanners()
            .then((response) => { setDataBanners(response.data.data) })
            .catch((error) => { console.log(error) })
    }

    useEffect(() => {
        fetchListBanner();
    }, [])

    return (
        <div className="container">
            <div className={cx('info')}>
                <h4>Quản lý banner</h4>
                <Button variant="contained" startIcon={<FontAwesomeIcon icon={faPlus} />}>Thêm mới</Button>
            </div>
            <TableBanners listBanners={dataBanners} />
        </div>
    );
}

export default ManageBanners;