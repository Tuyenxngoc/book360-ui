import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useFormik } from 'formik';
import * as yup from 'yup';

import httpRequest from '~/utils/httpRequest';
import useAuth from '~/hooks/useAuth';

import images from '~/assets';
import { TextField } from '@mui/material';
import { ROLES } from '~/config';

import Style from './Login.module.scss';
import classNames from 'classnames/bind';
import { LoadingButton } from '@mui/lab';

const validationSchema = yup.object({
    emailOrUsername: yup.string().required('Trường này là bắt buộc'),
    password: yup.string().required('Trường này là bắt buộc'),
});

const cx = classNames.bind(Style);

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login } = useAuth();
    const from = location.state?.from?.pathname || '/';
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formik = useFormik({
        initialValues: {
            emailOrUsername: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleLogin(values);
        },
    });

    const handleLogin = async (values) => {
        setIsLoading(true);
        try {
            const response = await httpRequest.post(`/auth/login`, values);
            if (response.status === 200) {
                const { accessToken, refreshToken, authorities } = response.data.data;
                const roleName = authorities[0].authority;
                login({ accessToken, refreshToken, roleName });
                if (roleName === ROLES.Admin) {
                    navigate('/admin', { replace: true });
                } else {
                    navigate(from, { replace: true });
                }
            }
        } catch (error) {
            let message = '';
            if (!error?.response) {
                message = ('Máy chủ không phản hồi');
            } else {
                message = ('Thông tin đăng nhập không đúng');
            }
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={cx('main')}>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-6'>
                        <div className={cx('title')}>Đăng nhập Book360</div>
                        <div className={cx('image')}>
                            <img src={images.logo} alt='logo' />
                        </div>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                variant='standard'
                                id='emailOrUsername'
                                name='emailOrUsername'
                                label='Nhập tên tài khoản/email'
                                value={formik.values.emailOrUsername}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.emailOrUsername && Boolean(formik.errors.emailOrUsername)}
                            />
                            <p className={cx('error-message')}>{formik.touched.emailOrUsername && formik.errors.emailOrUsername}&emsp;</p>
                            <TextField
                                fullWidth
                                variant='standard'
                                id='password'
                                name='password'
                                label='Nhập mật khẩu'
                                type='password'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                            />
                            <p className={cx('error-message')}>{formik.touched.password && formik.errors.password}&emsp;</p>
                            <div className={cx('forget-pass')}>
                                <Link to='/forgot-password'>Quên mật khẩu?</Link>
                            </div>
                            <div className={cx('login-btn')}>
                                <LoadingButton
                                    type='submit'
                                    loading={isLoading}
                                    variant='contained'
                                    fullWidth
                                >
                                    <span>Đăng nhập</span>
                                </LoadingButton>
                            </div>
                        </form>
                        <div className={cx('login-question')}>
                            <p>Bạn chưa có tài khoản? </p>
                            <Link to='/register'>Đăng ký ngay</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Login;