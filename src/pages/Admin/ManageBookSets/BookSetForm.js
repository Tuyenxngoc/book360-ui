import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import * as yup from 'yup';
import { useFormik } from 'formik';

import { routes } from '~/config';

import Style from './ManageBookSets.module.scss';
import classNames from 'classnames/bind';

import { createBookSet, getBookSet } from '~/services/bookSetService';
import AlertDialog from '~/components/Common/AlertDialog';

import { Input } from 'antd';

import { Button, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(Style);

function inputProps(isError, message) {
    if (isError) {
        return { status: 'error', placeholder: message };
    }
}

const defaultValue = {
    name: '',
};

const validationSchema = yup.object({
    name: yup
        .string()
        .min(3, 'Tên bộ sách tối thiểu 3 kí tự')
        .max(120, 'Tên bộ sách tối đa 120 kí tự')
        .required('Tên bộ sách là bắt buộc'),
});

function BookSetForm() {
    const navigate = useNavigate();
    const { bookSetId } = useParams();
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
        if (bookSetId) {
            getBookSet(bookSetId)
                .then((response) => {
                    const { name } = response.data.data;
                    formik.setValues({
                        name,
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            formik.setValues(defaultValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookSetId]);

    const handleSubmit = (values) => {
        setLoading(true);
        createBookSet(bookSetId || null, values)
            .then(() => {
                navigate(routes.viewBookSets, { replace: true });
                toast.success('Thành công');
            })
            .catch((error) => {
                if (error?.response?.data.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Có lỗi xảy ra');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleClose = () => {
        navigate(routes.viewBookSets, { replace: true });
    };

    return (
        <div className="container my-3">
            <div className="row justify-content-center">
                <div className="col-10">
                    <div className={cx('panel-wrapper')}>
                        <div className={cx('panel-header')}>
                            <div className={cx('panel-title')}>Thông tin cơ bản</div>
                        </div>
                        <div className="panel-content">
                            <div className={cx('form-group')}>
                                <label className={cx('form-label')} htmlFor="inputName">
                                    <span>*</span>Tên bộ sách
                                </label>
                                <div className={cx('form-input')}>
                                    <Input
                                        id="inputName"
                                        name="name"
                                        size="large"
                                        placeholder="Vui lòng nhập vào"
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

                            <div className={cx('button-group')}>
                                <AlertDialog
                                    open={showDialog}
                                    setOpen={setShowDialog}
                                    title={'Xác nhận'}
                                    description={'Hủy thay đổi'}
                                    handleSubmit={handleClose}
                                />
                                <Button
                                    variant="outlined"
                                    startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                                    onClick={() => setShowDialog(true)}
                                    sx={{ height: 35 }}
                                >
                                    <span>Quay lại</span>
                                </Button>
                                <LoadingButton
                                    loading={loading}
                                    variant="contained"
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

export default BookSetForm;
