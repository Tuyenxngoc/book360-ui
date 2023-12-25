import PropTypes from 'prop-types';

import Style from './ManageBanners.module.scss';
import classNames from 'classnames/bind';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faRemove, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from '~/config';
import { useState } from 'react';
import { deleteBanner } from '~/services/bannerService';
import { toast } from 'react-toastify';
import AlertDialog from '~/components/AlertDialog';

const cx = classNames.bind(Style);

function TableBanners({ listBanners }) {

    const navigate = useNavigate();
    const [bannerSelect, setBannerSelect] = useState();
    const [showDialogDelete, setShowDialogDelete] = useState(false);


    const handleClickBtnUpdate = (banner) => {
        navigate(`/admin/banner/${banner.id}`);
    }

    const handleClickBtnDelete = (bannerId) => {
        setShowDialogDelete(true);
        setBannerSelect(bannerId);
    }

    const handleDeleteBanner = () => {
        deleteBanner(bannerSelect)
            .then(() => {
                toast.success('Xoá thành công');
            })
            .catch(() => {
                toast.error('Có lỗi sảy ra');
            })
    }

    return (
        <>
            <AlertDialog
                open={showDialogDelete}
                setOpen={setShowDialogDelete}
                title={'Xóa banner'}
                description={'Bạn có chắc muốn xóa banner này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục danh mục.'}
                handleSubmit={handleDeleteBanner}
            />
            <table className="table table-bordered table-striped" style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th></th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Liên kết</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listBanners && listBanners.length > 0 ? (
                        listBanners.map((item, index) => {
                            return (
                                <tr key={`table-banners-${index}`}>
                                    <td align='center' style={{ padding: 0 }}>
                                        <div className={cx('preview-image')}>
                                            <a href={item.image} alt='preview image' target='_blank' rel="noreferrer">
                                                <FontAwesomeIcon icon={faUpDownLeftRight} />
                                            </a>
                                        </div>
                                    </td>
                                    <td align='left'>
                                        <div className={cx('banner-image')}>
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                    </td>
                                    <td align='left'>
                                        <div className={cx('banner-url')}>{item.url}</div>
                                    </td>
                                    <td align='left'>
                                        <div className={cx('banner-actions')}>

                                            <Button
                                                size='small'
                                                variant='contained'
                                                color='primary'
                                                onClick={() => handleClickBtnUpdate(item)}
                                                sx={{ minWidth: 35, height: 35 }}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button
                                                size='small'
                                                variant='contained'
                                                color='error'
                                                onClick={() => handleClickBtnDelete(item.id)}
                                                sx={{ minWidth: 35, height: 35, ml: 1 }}
                                            >
                                                <FontAwesomeIcon icon={faRemove} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan="1">Not found data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

TableBanners.propTypes = {
    listBanners: PropTypes.arrayOf(
        PropTypes.shape({
            image: PropTypes.string,
            url: PropTypes.string,
        })
    ),
};

export default TableBanners;