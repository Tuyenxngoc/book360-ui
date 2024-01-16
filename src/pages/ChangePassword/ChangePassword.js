import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Input } from 'antd';
import { LoadingButton } from '@mui/lab';
import { FormHelperText } from '@mui/material';

import Style from './ChangePassword.module.scss';
import classNames from 'classnames/bind';

import * as yup from 'yup';
import { useFormik } from 'formik';

import { changePassword } from '~/services/authService';

const validationSchema = yup.object({
    oldPassword: yup.string()
        .required('Vui lòng nhập mật khẩu cũ'),
    password: yup.string()
        .min(6, 'Mật khẩu tối thiểu 6 kí tự')
        .max(16, 'Mật khẩu tối đa 16 kí tự')
        .matches(/(?=.*[a-zA-Z])/, 'Mật khẩu phải chứa ít nhất một chữ cái')
        .matches(/(?=.*\d)/, 'Mật khẩu phải chứa ít nhất một số')
        .notOneOf([yup.ref('oldPassword'), null], 'Mật khẩu mới không được trùng với mật khẩu cũ')
        .required('Vui lòng nhập mật khẩu'),
    repeatPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu và Mật khẩu xác nhận không giống nhau')
        .required('Vui lòng xác nhận lại mật khẩu'),
});

const cx = classNames.bind(Style);

function ChangePassword() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState();

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            password: '',
            repeatPassword: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleSubmit = (values) => {
        setIsLoading(true);
        changePassword(values)
            .then((response) => {
                toast.success('Thay đổi mật khẩu thành công');
                navigate('/profile', { replace: true });
            })
            .catch((error) => {
                toast.error('Đã có lỗi xảy ra, vui lòng thử lại sau.')
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <main>
            <div className={cx('main-content')}>
                <div className='row'>
                    <div className='col-12'>
                        <div className={cx('header')}>
                            <h3 className={cx('title')}>Đổi mật khẩu</h3>
                            <div className={cx('description')}>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</div>
                        </div>
                    </div>
                </div>

                <div className='row pt-4'>
                    <div className='col'>
                        <form onSubmit={formik.handleSubmit}>
                            <div className={cx('form-group')}>
                                <label>Mật khẩu</label>
                                <div className='form-input'>
                                    <Input.Password
                                        size='large'
                                        id='oldPassword'
                                        name='oldPassword'
                                        value={formik.values.oldPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        status={(formik.touched.oldPassword && Boolean(formik.errors.oldPassword)) ? 'error' : ''}
                                    />
                                    {formik.touched.oldPassword && formik.errors.oldPassword && (
                                        <FormHelperText error>{formik.errors.oldPassword}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label>Mật khẩu mới</label>
                                <div className='form-input'>
                                    <Input.Password
                                        size='large'
                                        id='password'
                                        name='password'
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        status={(formik.touched.password && Boolean(formik.errors.password)) ? 'error' : ''}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <FormHelperText error>{formik.errors.password}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label>Xác nhận mật khẩu</label>
                                <div className='form-input'>
                                    <Input.Password
                                        size='large'
                                        id='repeatPassword'
                                        name='repeatPassword'
                                        value={formik.values.repeatPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        status={(formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)) ? 'error' : ''}
                                    />
                                    {formik.touched.repeatPassword && formik.errors.repeatPassword && (
                                        <FormHelperText error>{formik.errors.repeatPassword}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label></label>
                                <LoadingButton
                                    type='submit'
                                    variant='contained'
                                    loading={isLoading}
                                >
                                    <span>Xác nhận</span>
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ChangePassword;