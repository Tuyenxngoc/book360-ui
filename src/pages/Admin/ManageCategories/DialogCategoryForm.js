import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button as ButtonAnt, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import Style from './ManageCategories.module.scss';
import classNames from 'classnames/bind';
import { uploadImage } from '~/services/customerService';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect } from 'react';
import { createCategory } from '~/services/categoryService';
import { toast } from 'react-toastify';

const cx = classNames.bind(Style);

const defaultValues = {
    image: '',
    name: '',
}
function inputProps(isError, message) {
    if (isError) {
        return {
            status: 'error',
            placeholder: message,
        };
    }
}

const validationSchema = yup.object({
    name: yup.string()
        .min(3, "Tên danh mục tối thiểu 3 kí tự")
        .max(120, "Tên danh mục tối đa 120 kí tự")
        .required('Tên danh mục là bắt buộc'),
});

const customRequest = async ({ file, onSuccess, onError }) => {
    try {
        const response = await uploadImage(file);
        onSuccess(response.data.data, file);
    } catch (error) {
        onError(error);
    }
};

function DialogCategoryForm({ open, setOpen, dataCategory, fetchListCategory }) {

    const formik = useFormik({
        initialValues: defaultValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        if (open) {
            formik.handleReset();
            if (dataCategory) {
                formik.setValues({ name: dataCategory.name, image: dataCategory.image })
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, dataCategory]);

    const props = {
        name: 'file',
        customRequest,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                formik.setFieldValue('image', info.file.response);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (values) => {
        createCategory(dataCategory?.id || -1, values)
            .then(() => {
                fetchListCategory();
                toast.success('Thành công');
            })
            .catch(() => { toast.error('Có lỗi xảy ra'); })
            .finally(() => { setOpen(false); })
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Danh mục</DialogTitle>
            <DialogContent>
                <div className='row gy-3'>
                    <div className='col-12'>
                        <div className={cx('form-group')}>
                            <label htmlFor='inputNameCategory' className={cx('form-label')}>Tên danh mục</label>
                            <Input
                                id='inputNameCategory'
                                name='name'
                                placeholder='Vui lòng nhập vào'
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                showCount
                                maxLength={120}
                                {...inputProps(formik.touched.name && Boolean(formik.errors.name), formik.errors.name)}
                            />
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className={cx('form-group')}>
                            <label className={cx('form-label')}>Ảnh danh mục</label>
                            <Upload
                                {...props}
                                accept=".png,.jpg,.jpeg"
                            >
                                <ButtonAnt icon={<UploadOutlined />}>Click to Upload</ButtonAnt>
                            </Upload>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={formik.handleSubmit}>Lưu</Button>
            </DialogActions>
        </Dialog>
    );
}

DialogCategoryForm.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    dataCategory: PropTypes.object,
    fetchListCategory: PropTypes.func.isRequired,
};

export default DialogCategoryForm;