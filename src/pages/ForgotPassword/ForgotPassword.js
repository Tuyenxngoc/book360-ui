// React and Related Libraries
import { Link, useNavigate } from 'react-router-dom';

// UI Libraries
import { Button, TextField } from '@mui/material';

// State Management and Authentication
import { useFormik } from 'formik';
import * as yup from 'yup';

// User Interface and Styling
import Style from './ForgotPassword.module.scss';
import classNames from 'classnames/bind';

// Utilities and Support Libraries
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import images from '~/assets';

// Network Communication and System Utilities
import httpRequest from '~/utils/httpRequest';

const cx = classNames.bind(Style);

function ForgotPassword() {
    const navigate = useNavigate();
    const validationSchema = yup.object({
        username: yup.string().required('Trường này là bắt buộc'),
        email: yup.string().email('Định dạng email chưa đúng').required('Trường này là bắt buộc'),
    });
    const handleForgotPassword = async (values) => {
        try {
            const response = await httpRequest.post('/auth/forget-password', values);
            if (response.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau", {
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
    }
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleForgotPassword(values);
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
                                <div className={cx('title')}>Quên mật khẩu</div>
                            </div>
                            <div className={cx('image')}>
                                <img src={images.logo} alt='logo'></img>
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
                                        : "(*) Mật khẩu mới sẽ được gửi qua email này"}
                                </p>

                                <div className={cx('forget-btn')}>
                                    <Button color="primary" variant="contained" fullWidth type="submit">Xác nhận</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ForgotPassword;