import PropTypes from 'prop-types';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Style from './ManageBanners.module.scss';
import classNames from 'classnames/bind';

import { deleteBanner } from '~/services/bannerService';
import AlertDialog from '~/components/Common/AlertDialog';

import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faRemove, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Style);

function TableBanners({ listBanners, fetchListBanner }) {
    const navigate = useNavigate();
    const [bannerSelect, setBannerSelect] = useState();
    const [showDialogDelete, setShowDialogDelete] = useState(false);

    const handleClickBtnUpdate = (banner) => {
        navigate(`/admin/banner/${banner.id}`);
    };

    const handleClickBtnDelete = (bannerId) => {
        setShowDialogDelete(true);
        setBannerSelect(bannerId);
    };

    const handleDeleteBanner = () => {
        deleteBanner(bannerSelect)
            .then(() => {
                fetchListBanner();
                toast.success('Xoá thành công');
            })
            .catch(() => {
                toast.error('Có lỗi sảy ra');
            });
    };

    return (
        <>
            <AlertDialog
                open={showDialogDelete}
                setOpen={setShowDialogDelete}
                title={'Xóa banner'}
                description={
                    'Bạn có chắc muốn xóa banner này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục.'
                }
                handleSubmit={handleDeleteBanner}
            />
            <table className="table table-bordered table-striped" style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th></th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Thứ tự xem</th>
                        <th scope="col">Liên kết</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listBanners && listBanners.length > 0 ? (
                        listBanners.map((item, index) => {
                            return (
                                <tr key={`table-banners-${index}`}>
                                    <td align="center" style={{ padding: 0, width: '80px' }}>
                                        <div className={cx('preview-image')}>
                                            <a href={item.image} alt="preview image" target="_blank" rel="noreferrer">
                                                <FontAwesomeIcon icon={faUpDownLeftRight} />
                                            </a>
                                        </div>
                                    </td>
                                    <td align="left">
                                        <div className={cx('banner-image')}>
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                    </td>
                                    <td align="left">
                                        <div className={cx('banner-view-order')}>{item.viewOrder}</div>
                                    </td>
                                    <td align="left">
                                        <div className={cx('banner-url')}>{item.url}</div>
                                    </td>
                                    <td align="left">
                                        <div className="banner-actions">
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleClickBtnUpdate(item)}
                                                sx={{ minWidth: 35, height: 35 }}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleClickBtnDelete(item.id)}
                                                sx={{ minWidth: 35, height: 35, ml: 1 }}
                                            >
                                                <FontAwesomeIcon icon={faRemove} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5">
                                <div className={cx('no-result')}>
                                    <div className={cx('icon')} />
                                    <div className={cx('text')}>Chưa có dữ liệu</div>
                                </div>
                            </td>
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
        }),
    ),
    fetchListBanner: PropTypes.func.isRequired,
};

export default TableBanners;
