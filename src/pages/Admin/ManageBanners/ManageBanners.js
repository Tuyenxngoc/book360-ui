import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import TableBanners from "./TableBanners";

import Style from './ManageBanners.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(Style);

function ManageBanners() {
    return (
        <div className="container">
            <div className={cx('info')}>
                <h4>Quản lý banner</h4>
                <Button variant="contained" startIcon={<FontAwesomeIcon icon={faPlus} />}>Thêm mới</Button>
            </div>
            <TableBanners />
        </div>
    );
}

export default ManageBanners;