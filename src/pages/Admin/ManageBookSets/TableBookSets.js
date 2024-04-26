import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '@mui/material';

import Style from './ManageBookSets.module.scss';
import classNames from 'classnames/bind';

import AlertDialog from '~/components/Common/AlertDialog';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faRemove } from '@fortawesome/free-solid-svg-icons';
import { deleteBookSet } from '~/services/bookSetService';

const cx = classNames.bind(Style);

function TableBookSets({ listBookSet, fetchListBookSet }) {

    const navigate = useNavigate();

    const [bookSetSelect, setBookSetSelect] = useState();
    const [showDialogDelete, setShowDialogDelete] = useState(false);

    const handleClickBtnUpdate = (bookSet) => {
        navigate(`/admin/book-set/update/${bookSet.id}`);
    }

    const handleClickBtnDelete = (bookSetId) => {
        setShowDialogDelete(true);
        setBookSetSelect(bookSetId);
    }

    const handleDeleteBookSet = () => {
        deleteBookSet(bookSetSelect)
            .then(() => {
                fetchListBookSet();
                toast.success('Xoá thành công');
            })
            .catch((error) => {
                if (error?.response?.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Có lỗi sảy ra');
                }
            })
    }

    const handleClickViewBookSet = (id) => {
        navigate(`/admin/book-set/${id}`);
    }

    return (
        <div>
            <AlertDialog
                open={showDialogDelete}
                setOpen={setShowDialogDelete}
                title={'Xóa bộ sách'}
                description={'Bạn có chắc muốn xóa bộ sách này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục.'}
                handleSubmit={handleDeleteBookSet}
            />
            <table className='table table-striped table-bordered' style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th scope='col'>Tên bộ sách</th>
                        <th scope='col'>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listBookSet.length > 0 ? (listBookSet.map((item, index) => (
                        <tr key={`table-bookSets-${index}`}>
                            <td align='left'>{item.name}</td>
                            <td align='left'>
                                <div className={cx('table-action')}>
                                    <Button
                                        size='small'
                                        variant='contained'
                                        color='success'
                                        onClick={() => handleClickViewBookSet(item.id)}
                                        sx={{ minWidth: 35, height: 35 }}
                                    >
                                        <FontAwesomeIcon icon={faEye} />
                                    </Button>
                                    <Button
                                        size='small'
                                        variant='contained'
                                        color='primary'
                                        onClick={() => handleClickBtnUpdate(item)}
                                        sx={{ minWidth: 35, height: 35, mx: 1 }}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button
                                        size='small'
                                        variant='contained'
                                        color='error'
                                        onClick={() => handleClickBtnDelete(item.id)}
                                        sx={{ minWidth: 35, height: 35 }}
                                    >
                                        <FontAwesomeIcon icon={faRemove} />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))) : (
                        <tr>
                            <td colSpan='2'>Chưa có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

TableBookSets.propTypes = {
    listBookSet: PropTypes.array.isRequired,
    fetchListBookSet: PropTypes.func.isRequired,
};

export default TableBookSets;