import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import httpRequest from "~/utils/httpRequest";
import useAuth from '~/hooks/useAuth';

import Style from './Login.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import { Button, TextField } from '@mui/material';
import { decodeToken } from 'react-jwt';

const cx = classNames.bind(Style);

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const { login } = useAuth();
    const [isError, setIsError] = useState(false);

    const validationSchema = yup.object({
        emailOrUsername: yup
            .string('Enter your username of email')
            .required('Email is required'),
        password: yup
            .string('Enter your password')
            .required('Password is required'),
    });

    const handleLogin = async (values) => {
        try {
            const response = await httpRequest.post(`http://localhost:8080/api/v1/auth/login`, values);
            if (response.status === 200) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("username");

                localStorage.setItem("accessToken", response.data.data.accessToken);
                localStorage.setItem("username", values.emailOrUsername);
                login({
                    id: decodeToken(response.data.data.accessToken).sub,
                    user: values.emailOrUsername,
                    role: response.data.data.authorities[0].authority,
                    accessToken: response.data.data.accessToken
                })
                navigate(from, { replace: true });
            }
        } catch (error) {
            setIsError(true);
        }
    };

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

    return (
        <main className={cx('main')}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-6">
                        <div className={cx('title')}>Đăng nhập Book360</div>
                        <div className={cx('image')}>
                            <img src={images.logo} alt='logo'></img>
                        </div>

                        <form className={cx('form-signin')} onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                variant='standard'
                                id="emailOrUsername"
                                name="emailOrUsername"
                                label="Nhập số điện thoại/email"
                                value={formik.values.emailOrUsername}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.emailOrUsername && Boolean(formik.errors.emailOrUsername)}
                                helperText={formik.touched.emailOrUsername ? formik.errors.emailOrUsername : " "}
                            />
                            <TextField
                                fullWidth
                                variant='standard'
                                id="password"
                                name="password"
                                label="Nhập mật khẩu"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password ? formik.errors.password : " "}
                            />
                            <div className={cx('forget-pass')}>
                                <Link to='/forgot-password'>Quên mật khẩu?</Link>
                            </div>
                            <div className={cx('login-btn')}>
                                <Button color="primary" variant="contained" fullWidth type="submit" >Đăng nhập</Button>
                            </div>
                        </form>

                        <div className={cx('login-question')}>
                            <p className="login-question__text">Bạn chưa có tài khoản? </p>
                            <Link to="/register">Đăng ký ngay</Link>
                        </div>
                        {
                            isError &&
                            <div className="alert alert-danger" role="alert">
                                Thông tin đăng nhập chưa chính xác
                            </div>
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Login;