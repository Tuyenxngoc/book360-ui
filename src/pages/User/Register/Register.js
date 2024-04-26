import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { LoadingButton } from '@mui/lab';
import { FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';

import * as yup from 'yup';
import { useFormik } from 'formik';

import Style from './Register.module.scss';
import classNames from 'classnames/bind';

import images from '~/assets';
import { register } from '~/services/authService';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const cx = classNames.bind(Style);

const validationSchema = yup.object({
    username: yup
        .string()
        .min(4, 'Tên tài khoản tối thiểu 4 kí tự')
        .max(16, 'Tên tài khoản tối đa 16 kí tự')
        .matches(/^[^\W_]+$/, 'Tên tài khoản không được chứa kí tự đặc biệt')
        .matches(/^[^A-Z]+$/, 'Tên tài khoản không được viết hoa')
        .matches(/^[a-z]/, 'Tên tài khoản phải bắt đầu bằng chữ cái')
        .required('Vui lòng nhập tên đăng nhập'),

    email: yup.string().email('Định dạng email chưa đúng').required('Vui lòng nhập email'),

    password: yup
        .string()
        .min(6, 'Mật khẩu tối thiểu 6 kí tự')
        .max(30, 'Mật khẩu tối đa 30 kí tự')
        .matches(/(?=.*[a-zA-Z])/, 'Mật khẩu phải chứa ít nhất một chữ cái')
        .matches(/(?=.*\d)/, 'Mật khẩu phải chứa ít nhất một số')
        .required('Vui lòng nhập mật khẩu'),

    repeatPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu chưa khớp')
        .required('Vui lòng xác nhận lại mật khẩu'),
});

function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowRepeatPassword = () => setShowRepeatPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleRegister = async (values) => {
        setIsLoading(true);
        try {
            const response = await register(values);
            if (response.status === 200) {
                toast.success('Đăng ký thành công');
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
            let message = '';
            if (!error?.response) {
                message = 'Máy chủ không phản hồi';
            } else if (error.response?.status === 400) {
                message = JSON.stringify(error.response?.data.message);
            } else if (error.response?.status === 500) {
                message = error.response?.data.message;
            } else {
                message = 'Đăng ký thất bại';
            }
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            repeatPassword: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleRegister(values);
        },
    });

    return (
        <div>
            <main className={cx('main')}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-6">
                            <div className={cx('navbar-container')}>
                                <div className={cx('button-back')}>
                                    <Link to="/login">
                                        {' '}
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </Link>
                                </div>
                                <div className={cx('title')}>Đăng ký Book360</div>
                            </div>
                            <div className={cx('image')}>
                                <img src={images.logo} alt="logo" />
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="username"
                                    name="username"
                                    label="Nhập tên tài khoản"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                />
                                <p
                                    className={cx(
                                        'message',
                                        formik.touched.username && formik.errors.username && 'error',
                                    )}
                                >
                                    {formik.touched.username && formik.errors.username}
                                    &emsp;
                                </p>
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    id="email"
                                    name="email"
                                    label="Nhập email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                />
                                <p className={cx('message', formik.touched.email && formik.errors.email && 'error')}>
                                    {formik.touched.email && formik.errors.email
                                        ? formik.errors.email
                                        : '(*) Hóa đơn VAT khi mua hàng sẽ được gửi qua email này'}
                                </p>
                                <FormControl
                                    fullWidth
                                    variant="standard"
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                >
                                    <InputLabel htmlFor="password">Nhập mật khẩu</InputLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <p
                                    className={cx(
                                        'message',
                                        formik.touched.password && formik.errors.password && 'error',
                                    )}
                                >
                                    {formik.touched.password && formik.errors.password
                                        ? formik.errors.password
                                        : '(*) Mật khẩu tối thiểu 6 ký tự, ít nhất một chữ cái, ít nhất một chữ số'}
                                </p>
                                <FormControl
                                    fullWidth
                                    variant="standard"
                                    error={formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)}
                                >
                                    <InputLabel htmlFor="repeatPassword">Nhập lại mật khẩu</InputLabel>
                                    <Input
                                        id="repeatPassword"
                                        name="repeatPassword"
                                        type={showRepeatPassword ? 'text' : 'password'}
                                        value={formik.values.repeatPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle repeat password visibility"
                                                    onClick={handleClickShowRepeatPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showRepeatPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                                <p
                                    className={cx(
                                        'message',
                                        formik.touched.repeatPassword && formik.errors.repeatPassword && 'error',
                                    )}
                                >
                                    {formik.touched.repeatPassword && formik.errors.repeatPassword}
                                    &emsp;
                                </p>
                                <div className={cx('register-btn')}>
                                    <LoadingButton type="submit" loading={isLoading} variant="contained" fullWidth>
                                        <span>Đăng ký</span>
                                    </LoadingButton>
                                </div>
                            </form>
                            <div className={cx('register-question')}>
                                <p>Bạn đã có tài khoản?</p>
                                <Link to="/login"> Đăng nhập ngay</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Register;
