import { Button } from '@mui/material';
import Style from './ManageCategories.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';
import DialogCategoryForm from './DialogCategoryForm';
import AlertDialog from '~/components/AlertDialog';
import { deleteCategory } from '~/services/categoryService';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Style);

function TableCategories({ listCategory, fetchListCategory }) {

    const [categorySelect, setCategorySelect] = useState();

    const [showDialogUpdateCategory, setShowDialogUpdateCategory] = useState(false);
    const [showDialogDeleteCategory, setShowDialogDeleteCategory] = useState(false);

    const handleClickBtnUpdate = (category) => {
        setShowDialogUpdateCategory(true);
        setCategorySelect(category);
    }

    const handleClickBtnDelete = (category) => {
        setShowDialogDeleteCategory(true);
        setCategorySelect(category);
    }

    const handleDeleteCategory = () => {
        deleteCategory(categorySelect.id)
            .then(() => {
                fetchListCategory();
                toast.success('Xoá thành công');
            })
            .catch(() => {
                toast.error('Có lỗi sảy ra');
            })
    }

    return (
        <div>
            <DialogCategoryForm
                open={showDialogUpdateCategory}
                setOpen={setShowDialogUpdateCategory}
                dataCategory={categorySelect}
                fetchListCategory={fetchListCategory}
            />
            <AlertDialog
                open={showDialogDeleteCategory}
                setOpen={setShowDialogDeleteCategory}
                title={'Xóa danh mục'}
                description={'Bạn có chắc muốn xóa danh mục này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục danh mục.'}
                handleSubmit={handleDeleteCategory}
            />
            <table className="table table-striped table-bordered" style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Tên danh mục</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listCategory && listCategory.length > 0 &&
                        listCategory.map((item, index) => {
                            return (
                                <tr key={`table-categorys-${index}`}>
                                    <td>
                                        <div className={cx('image-category')}>
                                            {item.image ? (
                                                <img src={item.image} alt={`category id ${item.id}`} />
                                            ) : (
                                                <div>chưa có hình ảnh</div>
                                            )}
                                        </div>
                                    </td>
                                    <td>{item.name}</td>
                                    <td>
                                        <div className={cx('table-action')}>
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
                                                onClick={() => handleClickBtnDelete(item)}
                                                sx={{ minWidth: 35, height: 35, ml: 1 }}
                                            >
                                                <FontAwesomeIcon icon={faRemove} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    {listCategory && listCategory.length === 0
                        && <tr>
                            <td colSpan="4">Not found data</td>
                        </tr>
                    }

                </tbody>
            </table>
        </div>
    );
}

export default TableCategories;