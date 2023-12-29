import { Avatar, Button } from '@mui/material';

import Style from './ManageUsers.module.scss';
import classNames from 'classnames/bind';

import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from '@fortawesome/free-solid-svg-icons';
import images from '~/assets';

const cx = classNames.bind(Style);

function TableUsers({ listUsers }) {

    const navigate = useNavigate();

    return (
        <div>
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
                                                sx={{ minWidth: 35, height: 35, ml: 1 }}
                                                onClick={() => navigate(`/admin/user/${item.id}`)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
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