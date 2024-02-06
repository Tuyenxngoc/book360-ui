import { Avatar, Button, Dialog, DialogContent, TextField } from '@mui/material';
import images from '~/assets';

import Style from './Profile.module.scss';
import classNames from 'classnames/bind';

import useAuth from '~/hooks/useAuth';
import { useRef } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { updateCustomer, uploadAvatar } from '~/services/customerService';
import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import ShowDialog from '../Address/ShowDialog';
import { message } from 'antd';

const validationSchema = yup.object({
    fullName: yup.string()
        .max(25, 'Họ và tên không dài quá 25 ký tự.')
        .required('Vui lòng nhập họ tên'),

    address: yup.string()
        .required('Vui lòng nhập địa chỉ'),

    phoneNumber: yup.string()
        .matches(/^(?:\+84|0)(?:1[2689]|9[0-9]|3[2-9]|5[6-9]|7[0-9])(?:\d{7}|\d{8})$/, 'Phải là số điện thoại hợp lệ')
        .required('Số điện thoại là bắt buộc'),
});

const cx = classNames.bind(Style);

function Profile() {

    const fileInputRef = useRef(null);

    const { customer, updateCustomerInfo } = useAuth();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [isLoadingImage, setIsLoadingImage] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullName: customer.nickName || '',
            address: customer.address || '',
            phoneNumber: customer.phoneNumber || '',
            dob: "2024-02-06",
            gender: "MALE"
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleSelectInput = () => {
        fileInputRef.current.click();
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            if (
                (file.type === 'image/jpeg' || file.type === 'image/png') &&
                file.size <= 1024 * 1024 // 1MB
            ) {
                setIsLoadingImage(true);
                uploadAvatar(file)
                    .then((response) => {
                        updateCustomerInfo();
                        message.success('Thay đổi ảnh đại diện thành công.');
                    })
                    .catch((error) => { message.error('Đã có lỗi xảy ra, vui lòng thử lại sau.') })
                    .finally(() => { setIsLoadingImage(false); });
            } else {
                message.info('Vui lòng chọn file JPEG hoặc PNG có dung lượng tối đa 1MB.');
            }
        }
    };

    const handleSubmit = (values) => {
        setLoading(true);
        updateCustomer(values)
            .then((response) => {
                setOpen(true);
                updateCustomerInfo();
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleClickOpen = () => {
        setOpenAlertDialog(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-describedby='alert-dialog-description'
            >
                <DialogContent id='alert-dialog-description'>
                    <div className={cx('popup-container')}>
                        <img src={images.success} alt='success' />
                        Cập nhật thông tin thành công
                    </div>
                </DialogContent>
            </Dialog>

            <ShowDialog
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                setSelectedAddress={(address) => { formik.setFieldValue('address', address) }}
            />

            <div className={cx('main-content')}>
                <div className='row'>
                    <div className='col-12'>
                        <div className={cx('header')}>
                            <h3 className={cx('title')}>Hồ sơ của tôi</h3>
                            <div>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
                        </div>
                    </div>
                </div>

                <div className='row pt-4'>
                    <div className='col-8'>
                        <form onSubmit={formik.handleSubmit}>
                            <div className={cx('form-group')}>
                                <label>Tên đăng nhập</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    disabled
                                    defaultValue={customer.username}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Tên</label>
                                <TextField
                                    fullWidth
                                    size='small'
                                    id='fullName'
                                    name='fullName'
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                    helperText={formik.touched.fullName && formik.errors.fullName}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Email</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    disabled
                                    defaultValue={customer.email}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Số điện thoại</label>
                                <TextField
                                    fullWidth
                                    size='small'
                                    id='phoneNumber'
                                    name='phoneNumber'
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Địa chỉ</label>
                                <TextField
                                    fullWidth
                                    size='small'
                                    id='address'
                                    name='address'
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    onClick={handleClickOpen}
                                    error={formik.touched.address && Boolean(formik.errors.address)}
                                    helperText={formik.touched.address && formik.errors.address}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label></label>
                                <LoadingButton
                                    type='submit'
                                    variant='contained'
                                    loading={loading || isLoadingImage}
                                >
                                    <span>Lưu</span>
                                </LoadingButton>
                            </div>
                            <input
                                ref={fileInputRef}
                                type='file'
                                id='avatar'
                                name='avatar'
                                onChange={handleAvatarChange}
                                accept='.jpg,.jpeg,.png'
                                style={{ display: 'none' }}
                            />
                        </form>
                    </div>

                    <div className='col-4'>
                        <div className={cx('user-avt')}>
                            <div className={cx('avatar')}>
                                <Avatar
                                    alt='avatar'
                                    src={
                                        isLoadingImage
                                            ? (images.loading)
                                            : (
                                                (customer.avatar)
                                                    ? (customer.avatar)
                                                    : (images.userDefault))
                                    }
                                    sx={{ width: 100, height: 100, cursor: 'pointer' }}
                                    onClick={handleSelectInput}
                                />
                            </div>
                            <Button size='small' onClick={handleSelectInput} variant='outlined'>Chọn ảnh</Button>
                            <div className={cx('file-description')}>
                                <div>Dụng lượng file tối đa 2 MB</div>
                                <div>Định dạng: .JPG, .JPEG, .PNG</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;