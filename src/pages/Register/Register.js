import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import Style from './Register.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import httpRequest from '~/utils/httpRequest';
import { useState } from 'react';

const cx = classNames.bind(Style);

const toastSuccessSettings = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    hideCloseButton: true,
    progress: undefined,
    theme: "colored",
}

const toastErrorSettings = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    hideCloseButton: true,
    progress: undefined,
    theme: "colored",
}

const validationSchema = yup.object({
    username: yup.string()
        .min(4, 'Tên tài khoản tối thiểu 4 kí tự')
        .max(16, 'Tên tài khoản tối đa 16 kí tự')
        .matches(/^[^\W_]+$/, 'Tên tài khoản không được chứa kí tự đặc biệt')
        .matches(/^[^A-Z]+$/, 'Tên tài khoản không được viết hoa')
        .matches(/^[a-z]/, 'Tên tài khoản phải bắt đầu bằng chữ cái')
        .required('Trường này là bắt buộc'),

    email: yup.string()
        .email('Định dạng email chưa đúng')
        .required('Trường này là bắt buộc'),

    password: yup.string()
        .min(6, 'Mật khẩu tối thiểu 6 kí tự')
        .max(16, 'Mật khẩu tối đa 16 kí tự')
        .matches(/(?=.*[a-zA-Z])/, 'Mật khẩu phải chứa ít nhất một chữ cái')
        .matches(/(?=.*\d)/, 'Mật khẩu phải chứa ít nhất một số')
        .required('Trường này là bắt buộc'),

    repeatPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu chưa khớp')
        .required('Trường này là bắt buộc'),
});

function Register() {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (values) => {
        setIsLoading(true);
        try {
            const response = await httpRequest.post('/auth/register', values);
            if (response.status === 200) {
                toast.success("Đăng ký thành công", toastSuccessSettings);
                navigate('/login');
            }
        } catch (error) {
            let message = '';
            if (!error?.response) {
                message = "Máy chủ không phản hồi";
            } else if (error.response?.status === 400) {
                message = JSON.stringify(error.response?.data.message);
            } else if (error.response?.status === 500) {
                message = error.response?.data.message;
            } else {
                message = "Đăng ký thất bại";
            }
            toast.error(message, toastErrorSettings);
        } finally {
            setIsLoading(false);
        }
    }

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            repeatPassword: ""
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
                                    <Link to='/login'> <FontAwesomeIcon icon={faArrowLeft} /></Link>
                                </div>
                                <div className={cx('title')}>Đăng ký Book360</div>
                            </div>
                            <div className={cx('image')}>
                                <img src={images.logo} alt='logo' />
                            </div>

                            <form onSubmit={formik.handleSubmit}>

                                <TextField
                                    fullWidth
                                    variant='standard'
                                    id="username"
                                    name="username"
                                    label="Nhập tên tài khoản"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                />
                                <p className={cx('message', (formik.touched.username && formik.errors.username) && 'error')}>
                                    {formik.touched.username && formik.errors.username}
                                    &emsp;
                                </p>

                                <TextField
                                    fullWidth
                                    variant='standard'
                                    id="email"
                                    name="email"
                                    label="Nhập email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                />
                                <p className={cx('message', (formik.touched.email && formik.errors.email) && 'error')}>
                                    {(formik.touched.email && formik.errors.email)
                                        ? formik.errors.email
                                        : "(*) Hóa đơn VAT khi mua hàng sẽ được gửi qua email này"}
                                </p>

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
                                <p className={cx('message', (formik.touched.password && formik.errors.password) && 'error')}>
                                    {(formik.touched.password && formik.errors.password)
                                        ? formik.errors.password
                                        : "(*) Mật khẩu tối thiểu 6 ký tự, ít nhất một chữ cái, ít nhất một chữ số"}
                                </p>


                                <TextField
                                    fullWidth
                                    variant='standard'
                                    id="repeatPassword"
                                    name="repeatPassword"
                                    label="Nhập lại mật khẩu"
                                    type="password"
                                    value={formik.values.repeatPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)}
                                />
                                <p className={cx('message', (formik.touched.repeatPassword && formik.errors.repeatPassword) && 'error')}>
                                    {formik.touched.repeatPassword && formik.errors.repeatPassword}
                                    &emsp;
                                </p>


                                <div className={cx('register-btn')}>
                                    <Button color="primary" variant="contained" fullWidth type="submit" disabled={isLoading}>Đăng ký</Button>
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