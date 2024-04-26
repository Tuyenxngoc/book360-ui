import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import * as yup from 'yup';
import { useFormik } from 'formik';

import { routes } from '~/config';

import Style from './ManageAuthors.module.scss';
import classNames from 'classnames/bind';

import { createAuthor, getAuthor } from '~/services/authorService';
import AlertDialog from '~/components/Common/AlertDialog';

import { Input, Upload, message } from 'antd';

import { Button, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { InboxOutlined } from '@ant-design/icons';
import { customerUpload } from '~/services/customerService';

const { TextArea } = Input;
const { Dragger } = Upload;


const cx = classNames.bind(Style);

function inputProps(isError, message) {
    if (isError) {
        return { status: 'error', placeholder: message, };
    }
}

const defaultValue = {
    fullName: '',
    biography: '',
    avatar: ''
}

const validationSchema = yup.object({
    fullName: yup.string()
        .min(3, 'Tên tác giả tối thiểu 3 kí tự')
        .max(120, 'Tên tác giả tối đa 120 kí tự')
        .required('Tên tác giả là bắt buộc'),

    biography: yup.string().trim().nullable()
        .min(10, 'Mô tả tiểu sử quá ngắn. Vui lòng nhập ít nhất 10 kí tự.')
        .max(3000, 'Mô tả tiểu sử quá dài. Vui lòng nhập tối đa 3000 kí tự.'),

    avatar: yup.string().trim().nullable()
        .url('Vui lòng nhập một URL hợp lệ'),
});

function AuthorForm() {

    const navigate = useNavigate();
    const { authorId } = useParams();
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
        if (authorId) {
            getAuthor(authorId)
                .then((response) => {
                    const { fullName, biography, avatar } = response.data.data;
                    formik.setValues({
                        fullName,
                        biography,
                        avatar
                    })
                })
                .catch((error) => { console.log(error); })
        } else {
            formik.setValues(defaultValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authorId]);

    const props = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        customRequest: customerUpload,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                formik.setFieldValue('avatar', info.file.response[0]);
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
        createAuthor(authorId || null, values)
            .then(() => {
                navigate(routes.viewAuthors, { replace: true });
                toast.success('Thành công');
            })
            .catch((error) => {
                if (error?.response?.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Có lỗi xảy ra');
                }
            })
            .finally(() => { setLoading(false); });
    }

    const handleClose = () => {
        navigate(routes.viewAuthors, { replace: true });
    }

    const handleRemoveImage = () => {
        formik.setFieldValue('avatar', '');
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
                                <label className={cx('form-label')} htmlFor='inputFullName'><span>*</span>Tên tác giả</label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id='inputFullName'
                                        name='fullName'
                                        size='large'
                                        placeholder='Vui lòng nhập vào'
                                        value={formik.values.fullName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.fullName && Boolean(formik.errors.fullName))}
                                    />
                                    {formik.touched.fullName && formik.errors.fullName && (
                                        <FormHelperText error>{formik.errors.fullName}</FormHelperText>
                                    )}
                                </div>
                            </div>

                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='formControlTextarea'>Tiểu sử</label>
                                <div className={cx('form-input')}>
                                    <TextArea
                                        id='formControlTextarea'
                                        name='biography'
                                        showCount
                                        maxLength={3000}
                                        value={formik.values.biography}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        {...inputProps(formik.touched.biography && Boolean(formik.errors.biography))}
                                        style={{ height: 100, resize: 'none', }}
                                    />
                                    {formik.touched.biography && formik.errors.biography && (
                                        <FormHelperText error>{formik.errors.biography}</FormHelperText>
                                    )}
                                </div>
                            </div>

                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor='inputAvatar'>Hình ảnh</label>
                                <div className={cx('form-input')}>
                                    {formik.values.avatar ? (
                                        <div className={cx('form-upload-image')} >
                                            <img className={cx('image-upload')} src={formik.values.avatar} alt='' />
                                            <div className={cx('image-tools')}>
                                                <button onClick={() => handleRemoveImage()} className={cx('delete-image')}>
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Dragger {...props}>
                                                <p className='ant-upload-drag-icon'>
                                                    <InboxOutlined />
                                                </p>
                                                <p className='ant-upload-text'>Nhấp hoặc kéo tệp vào khu vực này để tải lên</p>
                                                <p className='ant-upload-hint'>Kích thước đề xuất [200, 200]</p>
                                            </Dragger>
                                            {formik.touched.avatar && formik.errors.avatar && (
                                                <FormHelperText error>{formik.errors.avatar}</FormHelperText>
                                            )}
                                        </>
                                    )
                                    }
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

export default AuthorForm;