import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

import { useFormik } from 'formik';
import * as yup from 'yup';

//Style
import Style from './Address.module.scss';
import classNames from 'classnames/bind';

import { LoadingButton } from '@mui/lab';
import { getAddresse, saveLocationCustomer } from '~/services/addressService';

const cx = classNames.bind(Style);

const validationSchema = yup.object({
    fullName: yup.string().trim()
        .min(2, "Tên quá ngắn. Yêu cầu tối thiểu 2 ký tự.")
        .matches(/^\S+\s+\S+/, 'Vui lòng điền Họ & Tên')
        .required('Họ và tên là bắt buộc'),

    phoneNumber: yup.string().trim()
        .matches(/^(?:\+84|0)(?:1[2689]|9[0-9]|3[2-9]|5[6-9]|7[0-9])(?:\d{7}|\d{8})$/, 'Số điện thoại không hợp lệ')
        .required('Số điện thoại là bắt buộc'),

    fullAddress: yup.string().trim()
        .required('Địa chỉ là bắt buộc'),

    detailedAddress: yup.string().trim()
        .min(5, 'Địa chỉ quá ngắn. Địa chỉ phải có 5 ký tự trở lên')
        .required('Địa chỉ cụ thể là bắt buộc'),

});

function defaultFunction() { }

function DialogCreateAddress({
    open,
    setOpen,
    addressId,
    onClose = defaultFunction,
    onSuccess = defaultFunction,
    titleDescription,
    defaultAddress = false,
}) {

    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            phoneNumber: '',
            fullAddress: '',
            detailedAddress: '',
            latitude: '',
            longitude: '',
            type: 'HOME',
            defaultAddress,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleClickBtnClose = () => {
        handleClose();
        onClose();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (values) => {
        setIsLoading(true);
        saveLocationCustomer(addressId || null, values)
            .then((response) => {
                onSuccess();
                handleClose();
            })
            .catch((error) => {
                toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
            })
            .finally(() => { setIsLoading(false); });
    }

    const getCurrentLocation = async () => {
        try {
            if (!navigator.geolocation) {
                throw new Error('Geolocation is not supported by this browser.');
            }

            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            });

            formik.setFieldValue('latitude', position.latitude);
            formik.setFieldValue('longitude', position.longitude);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCurrentLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (addressId) {
            getAddresse(addressId)
                .then((response) => {
                    const {
                        fullName,
                        phoneNumber,
                        addressName,
                        type,
                        defaultAddress,
                        latitude,
                        longitude,
                    } = response.data.data;
                    formik.setValues({
                        fullName,
                        phoneNumber,
                        fullAddress: addressName,
                        type,
                        defaultAddress,
                        latitude,
                        longitude,
                    })
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressId, open]);

    useEffect(() => {
        if (open) {
            formik.handleReset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <Dialog
            open={open}
            scroll='paper'
            disableEscapeKeyDown
            aria-labelledby='alert-dialog-title'
        >
            <DialogTitle id='alert-dialog-title'>
                <div className={cx('title')}>Địa chỉ mới</div>
                {titleDescription && <div className={cx('title-description')}>{titleDescription}</div>}
            </DialogTitle>
            <DialogContent>
                <div className='container gx-0'>
                    <div className='row g-4'>
                        <div className='col-12'>
                            <div className='row mt-2'>
                                <div className='col-6'>
                                    <TextField
                                        fullWidth
                                        size='small'
                                        label='Họ và tên'
                                        id='fullName'
                                        name='fullName'
                                        value={formik.values.fullName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                        helperText={formik.touched.fullName && formik.errors.fullName}
                                    />
                                </div>
                                <div className='col-6'>
                                    <TextField
                                        fullWidth
                                        size='small'
                                        label='Số điện thoại'
                                        id='phoneNumber'
                                        name='phoneNumber'
                                        value={formik.values.phoneNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='col-12'>
                            <TextField
                                fullWidth
                                size='small'
                                label='Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã'
                                id='fullAddress'
                                name='fullAddress'
                                value={formik.values.fullAddress}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.fullAddress && Boolean(formik.errors.fullAddress)}
                                helperText={formik.touched.fullAddress && formik.errors.fullAddress}
                            />
                        </div>
                        <div className='col-12'>
                            <TextField
                                fullWidth
                                label='Địa chỉ cụ thể'
                                id='detailedAddress'
                                name='detailedAddress'
                                size='small'
                                value={formik.values.detailedAddress}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.detailedAddress && Boolean(formik.errors.detailedAddress)}
                                helperText={formik.touched.detailedAddress && formik.errors.detailedAddress}
                            />
                        </div>
                        <div className='col-12'>
                            <p>Loại địa chỉ:</p>
                            <div>
                                <Button
                                    size='small'
                                    variant='outlined'
                                    color={formik.values.type === 'OFFICE' ? 'inherit' : 'primary'}
                                    onClick={() => formik.setFieldValue('type', 'HOME')}
                                >
                                    Nhà Riêng
                                </Button>
                                <Button
                                    size='small'
                                    variant='outlined'
                                    sx={{ ml: 1 }}
                                    color={formik.values.type === 'HOME' ? 'inherit' : 'primary'}
                                    onClick={() => formik.setFieldValue('type', 'OFFICE')}
                                >
                                    Văn Phòng
                                </Button>
                            </div>
                        </div>
                        <div className='col-12'>
                            <Checkbox
                                checked={formik.values.defaultAddress}
                                onChange={(event) => formik.setFieldValue('defaultAddress', event.target.checked)}
                            />
                            <span>Đặt làm địa chỉ mặc định</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions sx={{ py: 2, px: 3 }}>
                <Button
                    sx={{ minWidth: 140 }}
                    size='small'
                    onClick={handleClickBtnClose}
                >
                    Trở lại
                </Button>
                <LoadingButton
                    sx={{ minWidth: 140, ml: 1 }}
                    variant='contained'
                    size='small'
                    type='submit'
                    loading={isLoading}
                    onClick={formik.handleSubmit}
                >
                    <span>Hoàn thành</span>
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}

DialogCreateAddress.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    onSuccess: PropTypes.func,
    titleDescription: PropTypes.string,
};

export default DialogCreateAddress;