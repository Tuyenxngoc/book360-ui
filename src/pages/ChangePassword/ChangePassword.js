import { Button, TextField } from '@mui/material';
import Style from './ChangePassword.module.scss';
import classNames from "classnames/bind";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { changePassword } from '~/services/authService';
import useAuth from '~/hooks/useAuth';

const validationSchema = yup.object({
    oldPassword: yup.string()
        .required('Vui lòng nhập mật khẩu cũ'),
    password: yup.string()
        .min(6, 'Mật khẩu tối thiểu 6 kí tự')
        .max(16, 'Mật khẩu tối đa 16 kí tự')
        .matches(/(?=.*[a-zA-Z])/, 'Mật khẩu phải chứa ít nhất một chữ cái')
        .matches(/(?=.*\d)/, 'Mật khẩu phải chứa ít nhất một số')
        .required('Vui lòng nhập mật khẩu'),
    repeatPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu và Mật khẩu xác nhận không giống nhau')
        .required('Vui lòng xác nhận lại mật khẩu'),
});

const cx = classNames.bind(Style);

function ChangePassword() {

    const { user } = useAuth();

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            password: "",
            repeatPassword: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleSubmit = (values) => {
        changePassword(user.username, values)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <>
            <div className={cx('main-content')}>
                <div className="row">
                    <div className="col-12">
                        <div className={cx('header')}>
                            <h3 className={cx('title')}>Đổi mật khẩu</h3>
                            <div className={cx('description')}>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</div>
                        </div>
                    </div>
                </div>

                <div className="row pt-4">
                    <div className="col">
                        <form onSubmit={formik.handleSubmit}>

                            <div className={cx('form-group')}>
                                <label>Mật khẩu</label>
                                <TextField
                                    id="oldPassword"
                                    name="oldPassword"
                                    size='small'
                                    type="password"
                                    value={formik.values.oldPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                    helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                                />
                            </div>

                            <div className={cx('form-group')}>
                                <label>Mật khẩu mới</label>
                                <TextField
                                    id="password"
                                    name="password"
                                    size='small'
                                    type="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </div>

                            <div className={cx('form-group')}>
                                <label>Xác nhận mật khẩu</label>
                                <TextField
                                    id="repeatPassword"
                                    name="repeatPassword"
                                    size='small'
                                    type="password"
                                    value={formik.values.repeatPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)}
                                    helperText={formik.touched.repeatPassword && formik.errors.repeatPassword}
                                />
                            </div>
                            <div className={cx('form-group')}>
                                <label></label>
                                <Button color="primary" variant="contained" size='small' type="submit">
                                    Xác nhận
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>);
}

export default ChangePassword;