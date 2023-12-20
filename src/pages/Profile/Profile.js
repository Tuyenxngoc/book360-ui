import { Avatar, Button, Dialog, DialogContent, TextField } from '@mui/material';
import images from '~/assets';

import Style from './Profile.module.scss';
import classNames from 'classnames/bind';

import useAuth from '~/hooks/useAuth';
import { useRef } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { updateCustomer, uploadImage } from '~/services/customerService';
import { useState } from 'react';
import AlertDialog from '../Address/ShowDialog';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

const validationSchema = yup.object({
    name: yup.string()
        .max(25, 'Họ và tên không dài quá 25 ký tự.')
        .required('Vui lòng nhập họ tên'),

    address: yup.string()
        .required('Vui lòng nhập địa chỉ'),

    phonenumber: yup.string()
        .matches(/^(?:\+84|0)(?:1[2689]|9[0-9]|3[2-9]|5[6-9]|7[0-9])(?:\d{7}|\d{8})$/, 'Phải là số điện thoại hợp lệ')
        .required('Số điện thoại là bắt buộc'),
});

const cx = classNames.bind(Style);

function Profile() {
    const fileInputRef = useRef(null);
    const { user, customer, updateCustomerInfo } = useAuth();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openAlertDialog, setOpenAlertDialog] = useState(false);

    const [isLoadingImage, setIsLoadingImage] = useState(false);

    const formik = useFormik({
        initialValues: {
            name: customer.name || '',
            address: customer.address || '',
            phonenumber: customer.phonenumber || '',
            avatar: customer.avatar || '',
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
                uploadImage(file)
                    .then((response) => {
                        formik.setFieldValue('avatar', response.data.data);
                    })
                    .catch((error) => { console.log(error); })
                    .finally(() => { setIsLoadingImage(false); });
            } else {
                toast.warn('Vui lòng chọn file JPEG hoặc PNG có dung lượng tối đa 1MB.');
            }
        }
    };

    const handleSubmit = (values) => {
        setLoading(true);
        updateCustomer(customer.customerId, values)
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

            <AlertDialog
                openAlertDialog={openAlertDialog}
                setOpenAlertDialog={setOpenAlertDialog}
                setSelectedAddress={(address) => { formik.setFieldValue('address', address) }} />

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
                                    defaultValue={user.username}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Tên</label>
                                <TextField
                                    fullWidth
                                    size='small'
                                    id='name'
                                    name='name'
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Email</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    disabled
                                    defaultValue={user.email}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label>Số điện thoại</label>
                                <TextField
                                    fullWidth
                                    size='small'
                                    id='phonenumber'
                                    name='phonenumber'
                                    value={formik.values.phonenumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.phonenumber && Boolean(formik.errors.phonenumber)}
                                    helperText={formik.touched.phonenumber && formik.errors.phonenumber}
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
                                                (formik.values.avatar)
                                                    ? (formik.values.avatar)
                                                    : (images.userDefault))
                                    }
                                    sx={{ width: 100, height: 100, cursor: 'pointer' }}
                                    onClick={handleSelectInput}
                                />
                            </div>
                            <Button size='small' onClick={handleSelectInput} variant='outlined'>Chọn ảnh</Button>
                            <div className={cx('file-description')}>
                                <div>Dụng lượng file tối đa 1 MB</div>
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