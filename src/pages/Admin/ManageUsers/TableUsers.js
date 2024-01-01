import { Avatar, Button } from '@mui/material';

import Style from './ManageUsers.module.scss';
import classNames from 'classnames/bind';

import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faRemove } from '@fortawesome/free-solid-svg-icons';
import images from '~/assets';
import { useState } from 'react';
import AlertDialog from '~/components/AlertDialog';
import { toast } from 'react-toastify';
import { deleteCustomer } from '~/services/customerService';

const cx = classNames.bind(Style);

function TableUsers({ listUsers, fetchListUser }) {

    const [userSelect, setUserSelect] = useState();
    const [showDialogDelete, setShowDialogDelete] = useState(false);

    const navigate = useNavigate();

    const handleClickBtnDelete = (userId) => {
        setUserSelect(userId);
        setShowDialogDelete(true);
    }

    const handleDeleteUser = () => {
        deleteCustomer(userSelect)
            .then(() => {
                fetchListUser();
                toast.success('Xoá thành công');
            })
            .catch(() => {
                toast.error('Có lỗi sảy ra');
            })
    }

    return (
        <div>
            <AlertDialog
                open={showDialogDelete}
                setOpen={setShowDialogDelete}
                title={'Xóa khách hàng'}
                description={'Bạn có chắc muốn xóa khách hàng này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục.'}
                handleSubmit={handleDeleteUser}
            />
            <table className='table table-striped table-bordered' style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th scope='col'>Khách hàng</th>
                        <th scope='col'>Địa chỉ</th>
                        <th scope='col'>Số điện thoại</th>
                        <th scope='col'>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listUsers && listUsers.length > 0 ? (
                        listUsers.map((item, index) => {
                            return (
                                <tr key={`table-users-${index}`}>
                                    <td align='left'>
                                        <div className={cx('user-profile-card')}>
                                            <div className={cx('user-profile-avatar')}>
                                                <Avatar alt={item.name} src={item.avatar || images.userDefault} />
                                            </div>
                                            <div className={cx('user-profile-info')}>
                                                <div className={cx('user-profile-name')}>
                                                    <Link to='/'>{item.name}</Link>
                                                </div>
                                                <div className={cx('user-profile-email')}>user@gmail.com</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td align='left'>{item.address}</td>
                                    <td align='left'>{item.phonenumber}</td>
                                    <td align='left'>
                                        <div className='user-actions'>
                                            <Button
                                                size='small'
                                                variant='contained'
                                                color='success'
                                                sx={{ minWidth: 35, height: 35 }}
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </Button>
                                            <Button
                                                size='small'
                                                variant='contained'
                                                color='primary'
                                                sx={{ minWidth: 35, height: 35, mx: 1 }}
                                                onClick={() => navigate(`/admin/user/${item.id}`)}
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
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan='6'>Not found data</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TableUsers;