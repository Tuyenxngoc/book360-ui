import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Button } from '@mui/material';

import Style from './ManageAuthors.module.scss';
import classNames from 'classnames/bind';

import AlertDialog from '~/components/AlertDialog';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faRemove } from '@fortawesome/free-solid-svg-icons';
import { deleteAuthor } from '~/services/authorService';

const cx = classNames.bind(Style);

function TableAuthors({ listAuthor, fetchListAuthor }) {

    const navigate = useNavigate();

    const [authorSelect, setAuthorSelect] = useState();
    const [showDialogDelete, setShowDialogDelete] = useState(false);

    const handleClickBtnUpdate = (author) => {
        navigate(`/admin/author/update/${author.id}`);
    }

    const handleClickBtnDelete = (authorId) => {
        setShowDialogDelete(true);
        setAuthorSelect(authorId);
    }

    const handleDeleteAuthor = () => {
        deleteAuthor(authorSelect)
            .then(() => {
                fetchListAuthor();
                toast.success('Xoá thành công');
            })
            .catch(() => {
                toast.error('Có lỗi sảy ra');
            })
    }

    const handleClickViewAuthor = (id) => {
        navigate(`/admin/author/${id}`);
    }

    return (
        <div>
            <AlertDialog
                open={showDialogDelete}
                setOpen={setShowDialogDelete}
                title={'Xóa tác giả'}
                description={'Bạn có chắc muốn xóa tác giả này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục.'}
                handleSubmit={handleDeleteAuthor}
            />
            <table className='table table-striped table-bordered' style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th scope='col'>Tên tác giả</th>
                        <th scope='col'>Avavtar</th>
                        <th scope='col'>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listAuthor.length > 0 ? (listAuthor.map((item, index) => (
                        <tr key={`table-authors-${index}`}>
                            <td align='left'>{item.fullName}</td>
                            <td align='left'>
                                <div className={cx('image-author')}>
                                    {item.avatar ? (
                                        <img src={item.avatar} alt={`author id ${item.id}`} />
                                    ) : (
                                        'Chưa có hình ảnh'
                                    )}
                                </div>
                            </td>
                            <td align='left'>
                                <div className={cx('table-action')}>
                                    <Button
                                        size='small'
                                        variant='contained'
                                        color='success'
                                        onClick={() => handleClickViewAuthor(item.id)}
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
                            <td colSpan='4'>Chưa có dữ liệu</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

TableAuthors.propTypes = {
    listAuthor: PropTypes.array.isRequired,
    fetchListAuthor: PropTypes.func.isRequired,
};

export default TableAuthors;