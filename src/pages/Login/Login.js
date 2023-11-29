import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as yup from 'yup';

import httpRequest from "~/utils/httpRequest";
import useAuth from '~/hooks/useAuth';

import Style from './Login.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets';
import { Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';

const cx = classNames.bind(Style);

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const validationSchema = yup.object({
        emailOrUsername: yup.string().required('Trường này là bắt buộc'),
        password: yup.string().required('Trường này là bắt buộc'),
    });

    const handleLogin = async (values) => {
        try {
            const response = await httpRequest.post(`/auth/login`, values);
            if (response.status === 200) {
                const { accessToken, authorities, id, username, refreshToken } = response.data.data;
                login({
                    id,
                    username,
                    role: authorities[0].authority,
                    accessToken,
                    refreshToken
                })
                navigate(from, { replace: true });
            }
        } catch (error) {
            let message = '';
            if (!error?.response) {
                message = ('Máy chủ không phản hồi');
            } else {
                message = ('Đăng nhập thất bại');
            }
            toast.error(message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                hideCloseButton: true,
                progress: undefined,
                theme: "colored",
            });
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

                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                fullWidth
                                variant='standard'
                                id="emailOrUsername"
                                name="emailOrUsername"
                                label="Nhập tên tài khoản/email"
                                value={formik.values.emailOrUsername}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.emailOrUsername && Boolean(formik.errors.emailOrUsername)}
                            />
                            <p className={cx('error-message')}>{formik.touched.emailOrUsername && formik.errors.emailOrUsername}&emsp;</p>

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
                            />
                            <p className={cx('error-message')}>{formik.touched.password && formik.errors.password}&emsp;</p>

                            <div className={cx('forget-pass')}>
                                <Link to='/forgot-password'>Quên mật khẩu?</Link>
                            </div>
                            <div className={cx('login-btn')}>
                                <Button color="primary" variant="contained" fullWidth type="submit" >Đăng nhập</Button>
                            </div>
                        </form>

                        <div className={cx('login-question')}>
                            <p>Bạn chưa có tài khoản? </p>
                            <Link to="/register">Đăng ký ngay</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Login;