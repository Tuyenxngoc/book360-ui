import Style from './ManageUsers.module.scss';
import classNames from 'classnames/bind';

import { Input, Upload, message } from 'antd';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createCustomer, customerUpload } from '~/services/customerService';
import { routes } from '~/config';
import { toast } from 'react-toastify';
import { Button, FormHelperText } from '@mui/material';
import AlertDialog from '~/components/AlertDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { LoadingButton } from '@mui/lab';
import { InboxOutlined } from '@ant-design/icons';
import { getCustomer } from '~/services/apiRequest';
const { Dragger } = Upload;


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
}

const validationSchema = yup.object({

});

function UserForm() {

    const navigate = useNavigate();
    const { userId } = useParams();
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

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
                    const { name } = response.data.data;
                    formik.setValues({
                        name,
                    })
                })
                .catch((error) => { console.log(error); })
        } else {
            formik.setValues(defaultValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const props = {
        name: 'file',
        multiple: false,
        customRequest: customerUpload,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                formik.setFieldValue('image', info.file.response);
            }
            if (status === 'done') {
                message.success(`${info.file.name} tải tập tin thành công.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} tải tập tin thất bại.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleSubmit = (values) => {
        setLoading(true);
        createCustomer(userId || -1, values)
            .then(() => {
                navigate(routes.viewBanner, { replace: true });
                toast.success('Thành công');
            })
            .catch((error) => { console.log(error); })
            .finally(() => { setLoading(false); });
    }

    const handleClose = () => {
        navigate(routes.viewBanner, { replace: true });
    }

    return (
        <div className='container my-3'>
            <div className='row justify-content-center'>
                <div className='col-10'>
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
                                <label className={cx('form-label')} htmlFor='inputViewOrder'><span>*</span>Thứ tự hiển thị</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputViewOrder'
                                        name='viewOrder'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.viewOrder}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.viewOrder && Boolean(formik.errors.viewOrder))}
                                    />
                                    {formik.touched.viewOrder && formik.errors.viewOrder && (
                                        <FormHelperText error>{formik.errors.viewOrder}</FormHelperText>
                                    )}
                                </div>
                            </div>
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputUrl'><span>*</span>Hình ảnh</label>
                                <div className={cx('form-input')}>
                                    <Dragger {...props}>
                                        <p className='ant-upload-drag-icon'>
                                            <InboxOutlined />
                                        </p>
                                        <p className='ant-upload-text'>Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                                        <p className='ant-upload-hint'>Kích thước đề xuất [1920, 7750]</p>
                                    </Dragger>
                                    {formik.touched.image && formik.errors.image && (
                                        <FormHelperText error>{formik.errors.image}</FormHelperText>
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