import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as yup from 'yup';
import { useFormik } from 'formik';

import { customerUpload } from '~/services/customerService';
import { routes } from '~/config';

import Style from './ManageCategories.module.scss';
import classNames from 'classnames/bind';

import { Input } from 'antd';
import { message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Button, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AlertDialog from '~/components/AlertDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { createCategory, getCategory } from '~/services/categoryService';

const { Dragger } = Upload;

const cx = classNames.bind(Style);

function inputProps(isError, message) {
    if (isError) {
        return {
            status: 'error',
            placeholder: message,
        };
    }
}

const defaultValue = {
    image: '',
    name: '',
}

const validationSchema = yup.object({
    name: yup.string()
        .min(3, "Tên danh mục tối thiểu 3 kí tự")
        .max(120, "Tên danh mục tối đa 120 kí tự")
        .required('Tên danh mục là bắt buộc'),
});

function CategoryForm() {

    const navigate = useNavigate();
    const { categoryId } = useParams();
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
        if (categoryId) {
            getCategory(categoryId)
                .then((response) => {
                    const { image, name } = response.data.data;
                    formik.setValues({
                        image,
                        name,
                    })
                })
                .catch((error) => { console.log(error); })
        } else {
            formik.setValues(defaultValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId]);

    const props = {
        name: 'file',
        multiple: false,
        maxCount: 1,
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
        createCategory(categoryId || -1, values)
            .then(() => {
                navigate(routes.viewCategory, { replace: true });
                toast.success('Thành công');
            })
            .catch(() => { toast.error('Có lỗi xảy ra'); })
            .finally(() => { setLoading(false); });
    }

    const handleClose = () => {
        navigate(routes.viewCategory, { replace: true });
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
                                <label className={cx('form-label')} htmlFor='inputName'><span>*</span>Tên danh mục</label>
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
                                <label className={cx('form-label')} htmlFor='inputUrl'>Hình ảnh</label>
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

export default CategoryForm;