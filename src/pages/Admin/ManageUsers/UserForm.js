import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Style from './ManageUsers.module.scss';
import classNames from 'classnames/bind';

import { Input, Upload, message } from 'antd';

import * as yup from 'yup';
import { useFormik } from 'formik';

import { createCustomer, customerUpload, getCustomer } from '~/services/customerService';

import { routes } from '~/config';
import AlertDialog from '~/components/Common/AlertDialog';

import { Avatar, Button, FormHelperText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { LoadingButton } from '@mui/lab';

const cx = classNames.bind(Style);

function inputProps(isError) {
    if (isError) {
        return {
            status: 'error'
        };
    }
}

const defaultValue = {
    name: '',
    phoneNumber: '',
    avatar: '',
    email: '',
    address: '',
    username: '',
    password: '',
    repeatPassword: '',
    roleName: ''
}


const validationSchema = yup.object({
    name: yup.string()
        .required('Tên khách hàng là bắt buộc'),

    phoneNumber: yup.string()
        .required('Số điện thoại là bắt buộc'),

    avatar: yup.string(),

    email: yup.string().email('Địa chỉ email không hợp lệ')
        .required('Email là bắt buộc'),

    address: yup.string()
        .required('Địa chỉ là bắt buộc'),

    username: yup.string()
        .required('Tên đăng nhập là bắt buộc'),

    password: yup.string()
        .required('Mật khẩu là bắt buộc'),

    repeatPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
        .required('Xác nhận mật khẩu là bắt buộc'),

    roleName: yup.string()
        .required('Vai trò là bắt buộc')
});
function UserForm() {

    const navigate = useNavigate();
    const { userId } = useParams();
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const uploadRef = useRef();

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        if (userId) {
            getCustomer(userId)
                .then((response) => {
                    console.log(response.data.data);
                })
                .catch((error) => { console.log(error); })
        } else {
            formik.setValues(defaultValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const handleSubmit = (values) => {
        setLoading(true);
        createCustomer(values)
            .then(() => {
                navigate(routes.viewUsers, { replace: true });
                toast.success('Thành công');
            })
            .catch((error) => { console.log(error); })
            .finally(() => { setLoading(false); });
    }

    const handleClose = () => {
        navigate(routes.viewUsers, { replace: true });
    }

    const handleChange = (info) => {
        const { status } = info.file;
        if (status !== 'uploading') {
            formik.setFieldValue('avatar', info.file.response);
        }
        if (status === 'done') {
            message.success(`${info.file.name} tải tập tin thành công.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} tải tập tin thất bại.`);
        }
    };

    const handleChooseImageClick = () => {
        uploadRef.current.upload.uploader.onClick();
    };

    return (
        <div className='container my-3'>
            <div className='row justify-content-center gx-3'>
                <div className='col-4'>
                    <div className={cx('panel-wrapper')}>
                        <div className={cx('avatar-uploader')}>
                            <Upload
                                ref={uploadRef}
                                name="avatar"
                                listType="picture-circle"
                                showUploadList={false}
                                onChange={handleChange}
                                customRequest={customerUpload}
                                className={cx('uploader')}
                            >
                                <Avatar
                                    src={formik.values.avatar}
                                    alt="avatar"
                                    style={{
                                        width: '90%',
                                        height: '90%',
                                    }}
                                />
                            </Upload>
                            <Button size='small' variant='outlined' onClick={handleChooseImageClick}>Chọn ảnh</Button>
                            <div className={cx('file-description')}>
                                <div>Dụng lượng file tối đa 2 MB</div>
                                <div>Định dạng: .JPG, .JPEG, .PNG</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <div className={cx('panel-wrapper')}>
                        <div className={cx('panel-header')}>
                            <div className={cx('panel-title')}>
                                Thông tin cơ bản
                            </div>
                        </div>
                        <div className='panel-content'>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputName'><span>*</span>Tên khách hàng</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputName'
                                        name='name'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.name && Boolean(formik.errors.name))}
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <FormHelperText error>{formik.errors.name}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputPhoneNumber'><span>*</span>Số điện thoại</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputPhoneNumber'
                                        name='phoneNumber'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.phoneNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber))}
                                    />
                                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                                        <FormHelperText error>{formik.errors.phoneNumber}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputAddress'><span>*</span>Địa chỉ</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputAddress'
                                        name='address'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.address && Boolean(formik.errors.address))}
                                    />
                                    {formik.touched.address && formik.errors.address && (
                                        <FormHelperText error>{formik.errors.address}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputUserName'><span>*</span>Tên đăng nhập</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputUserName'
                                        name='username'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.username && Boolean(formik.errors.username))}
                                    />
                                    {formik.touched.username && formik.errors.username && (
                                        <FormHelperText error>{formik.errors.username}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputPassword'><span>*</span>Mật khẩu</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputPassword'
                                        name='password'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.password && Boolean(formik.errors.password))}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <FormHelperText error>{formik.errors.password}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputRepeatPassword'><span>*</span>Nhập lại mật khẩu</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputRepeatPassword'
                                        name='repeatPassword'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.repeatPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword))}
                                    />
                                    {formik.touched.repeatPassword && formik.errors.repeatPassword && (
                                        <FormHelperText error>{formik.errors.repeatPassword}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputEmail'><span>*</span>Email</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputEmail'
                                        name='email'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.email && Boolean(formik.errors.email))}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <FormHelperText error>{formik.errors.email}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputRole'><span>*</span>Vai trò</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputRole'
                                        name='roleName'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.roleName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.roleName && Boolean(formik.errors.roleName))}
                                    />
                                    {formik.touched.roleName && formik.errors.roleName && (
                                        <FormHelperText error>{formik.errors.roleName}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('button-group')}>
                                <AlertDialog
                                    open={showDialog}
                                    setOpen={setShowDialog}
                                    title={'Xác nhận'}
                                    description={'Hủy thay đổi'}
                                    handleSubmit={handleClose}
                                />
                                <Button
                                    variant='outlined'
                                    startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                                    onClick={() => setShowDialog(true)}
                                    sx={{ height: 35 }}
                                >
                                    <span>Quay lại</span>
                                </Button>
                                <LoadingButton
                                    loading={loading}
                                    variant='contained'
                                    startIcon={<FontAwesomeIcon icon={faSave} />}
                                    onClick={formik.handleSubmit}
                                    sx={{ height: 35, marginLeft: '10px' }}
                                >
                                    <span>Lưu</span>
                                </LoadingButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserForm;