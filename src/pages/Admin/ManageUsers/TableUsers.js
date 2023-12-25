import { Avatar, Button } from "@mui/material";

import Style from './ManageUsers.module.scss';
import classNames from 'classnames/bind';
import { Link } from "react-router-dom";

const cx = classNames.bind(Style);

function TableUsers({ listUsers }) {
    return (
        <div>
            <table className='table table-striped table-bordered' style={{ verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th scope='col'>Khách hàng</th>
                        <th scope='col'>Địa chỉ</th>
                        <th scope='col'>Số điện thoại</th>
                        <th scope='col'>Số đơn hàng</th>
                        <th scope='col'>Đã tiêu</th>
                        <th scope='col'>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {listUsers && listUsers.length > 0 ? (
                        listUsers.map((item, index) => {
                            return (
                                <tr key={`table-users-${index}`}>
                                    <td>
                                        <div className={cx('user-profile-card')}>
                                            <div className={cx('user-profile-avatar')}>
                                                <Avatar alt={item.name} src={item.avatar} />
                                            </div>
                                            <div className={cx('user-profile-info')}>
                                                <div className={cx('user-profile-name')}>
                                                    <Link to='/'>{item.name}</Link>
                                                </div>
                                                <div className={cx('user-profile-email')}>user@gmail.com</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {item.address}
                                    </td>
                                    <td>
                                        {item.phonenumber}
                                    </td>
                                    <td>
                                        0
                                    </td>
                                    <td>
                                        0
                                    </td>
                                    <td>
                                        <Button
                                            size='small'
                                            variant='contained'
                                            color='success'
                                        >
                                            Xem
                                        </Button>
                                        <Button
                                            size='small'
                                            className='mx-2'
                                            variant='contained'
                                            color='warning'
                                        >
                                            Cập nhật
                                        </Button>
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