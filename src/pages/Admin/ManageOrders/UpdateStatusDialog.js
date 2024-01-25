import { useEffect } from 'react';
import { toast } from 'react-toastify';
import queryString from 'query-string';

import { Select } from 'antd';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';

import Style from './MagageOrders.module.scss';
import classNames from 'classnames/bind';

import * as yup from 'yup';
import { useFormik } from 'formik';

import { updateBillStatus } from '~/services/billService';

const cx = classNames.bind(Style);

const defaultValues = {
    status: '',
}

function inputProps(isError) {
    if (isError) {
        return {
            status: 'error',
        };
    }
}

const ORDER_STATUSES = [
    { label: 'Chờ xử lý', key: 'to_pay', },
    { label: 'Đang giao hàng', key: 'to_receive', },
    { label: 'Đặt hàng thành công', key: 'ordered', },
    { label: 'Đã giao', key: 'completed', },
    { label: 'Đã hủy', key: 'canceled', }
]

const validationSchema = yup.object({
    status: yup.string().required('Vui lòng chọn'),
});

function UpdateStatusDialog({ open, setOpen, dataOrder, fetchListOrder }) {

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
            if (dataOrder) {
                const type = ORDER_STATUSES.find(r => r.label === dataOrder.status);
                formik.setValues({ status: type?.key || '' });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, dataOrder]);

    const handleClose = () => {
        setOpen(false);
    };

    function handleSubmit(values) {
        const item = ORDER_STATUSES.find(r => r.label === dataOrder.status);
        if (values.status !== item?.key) {
            const params = queryString.stringify({ newStatus: values.status });
            updateBillStatus(dataOrder.id || -1, params)
                .then(response => {
                    fetchListOrder();
                    toast.success('Cập nhật thành công');
                })
                .catch(error => toast.error('Đã có lỗi sảy ra'))
                .finally(() => setOpen(false));
        } else {
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Trạng thái đơn hàng</DialogTitle>
            <DialogContent sx={{ minWidth: '444px' }}>
                <div className='row gy-3'>
                    <div className='col-12'>
                        <div className={cx('form-group')}>
                            <div className={cx('form-input')}>
                                <Select
                                    id='status'
                                    name='status'
                                    size='large'
                                    placeholder='Vui lòng chọn'
                                    style={{ width: '100%' }}
                                    popupClassName={cx('form-popup')}
                                    value={formik.values.status || null}
                                    onChange={(value) => formik.setFieldValue('status', value)}
                                    onBlur={formik.handleBlur}
                                    options={ORDER_STATUSES.map(item => ({ value: item.key, label: item.label, }))}
                                    {...inputProps(formik.touched.status && Boolean(formik.errors.status))}
                                />
                                {formik.touched.status && formik.errors.status && (
                                    <FormHelperText error>{formik.errors.status}</FormHelperText>
                                )}
                            </div>
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

export default UpdateStatusDialog;