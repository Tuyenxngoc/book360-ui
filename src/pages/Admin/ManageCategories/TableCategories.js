import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '@mui/material';

import Style from './ManageCategories.module.scss';
import classNames from 'classnames/bind';

import AlertDialog from '~/components/Common/AlertDialog';
import { deleteCategory } from '~/services/categoryService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faRemove, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Style);

function TableCategories({ listCategory, fetchListCategory }) {
    const navigate = useNavigate();

    const [categorySelect, setCategorySelect] = useState();
    const [showDialogDelete, setShowDialogDelete] = useState(false);

    const handleClickBtnUpdate = (category) => {
        navigate(`/admin/category/${category.id}`);
    };

    const handleClickBtnDelete = (categoryId) => {
        setShowDialogDelete(true);
        setCategorySelect(categoryId);
    };

    const handleDeleteCategory = () => {
        deleteCategory(categorySelect)
            .then(() => {
                fetchListCategory();
                toast.success('Xoá thành công');
            })
            .catch((error) => {
                if (error?.response?.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Có lỗi sảy ra');
                }
            });
    };

    return (
        <div>
            <AlertDialog
                open={showDialogDelete}
                setOpen={setShowDialogDelete}
                title={'Xóa danh mục'}
                description={
                    'Bạn có chắc muốn xóa danh mục này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục danh mục.'
                }
                handleSubmit={handleDeleteCategory}
            />
            <table className="table table-striped table-bordered" style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th></th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Tên danh mục</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listCategory &&
                        listCategory.length > 0 &&
                        listCategory.map((item, index) => {
                            return (
                                <tr key={`table-categorys-${index}`}>
                                    <td align="center" style={{ padding: 0, width: '80px' }}>
                                        <div className={cx('preview-image')}>
                                            <a href={item.image} alt="preview image" target="_blank" rel="noreferrer">
                                                <FontAwesomeIcon icon={faUpDownLeftRight} />
                                            </a>
                                        </div>
                                    </td>
                                    <td align="left">
                                        <div className={cx('image-category')}>
                                            {item.image ? (
                                                <img src={item.image} alt={`category id ${item.id}`} />
                                            ) : (
                                                'Chưa có hình ảnh'
                                            )}
                                        </div>
                                    </td>
                                    <td align="left">{item.name}</td>
                                    <td align="left">
                                        <div className={cx('table-action')}>
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
                        })}
                    {listCategory && listCategory.length === 0 && (
                        <tr>
                            <td colSpan="5">Chưa có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

TableCategories.propTypes = {
    listCategory: PropTypes.array.isRequired,
    fetchListCategory: PropTypes.func.isRequired,
};

export default TableCategories;
