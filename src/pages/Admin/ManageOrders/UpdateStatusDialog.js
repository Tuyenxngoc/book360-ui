import { useEffect } from 'react';
import { toast } from 'react-toastify';

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
};

function inputProps(isError) {
    if (isError) {
        return {
            status: 'error',
        };
    }
}

const billStatus = [
    { label: 'Chờ xác nhận', value: 'WAIT_FOR_CONFIRMATION' },
    { label: 'Chờ lấy hàng', value: 'WAIT_FOR_DELIVERY' },
    { label: 'Đang giao', value: 'DELIVERING' },
    { label: 'Đã giao', value: 'DELIVERED' },
    { label: 'Đã hủy', value: 'CANCELLED' },
    { label: 'Trả hàng/Hoàn tiền', value: 'REFUND' },
    { label: 'Giao không thành công', value: 'DELIVERY_FAILED' },
];

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
                const type = billStatus.find((r) => r.value === dataOrder.billStatus);
                formik.setValues({ status: type?.value || '' });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, dataOrder]);

    const handleClose = () => {
        setOpen(false);
    };

    function handleSubmit(values) {
        const item = billStatus.find((r) => r.value === dataOrder.billStatus);
        if (values.status !== item?.value) {
            updateBillStatus(dataOrder.id, values.status)
                .then((response) => {
                    fetchListOrder();
                    toast.success('Cập nhật thành công');
                })
                .catch((error) => toast.error('Đã có lỗi sảy ra'))
                .finally(() => setOpen(false));
        } else {
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Trạng thái đơn hàng</DialogTitle>
            <DialogContent sx={{ minWidth: '444px' }}>
                <div className="row gy-3">
                    <div className="col-12">
                        <div className={cx('form-group')}>
                            <div className={cx('form-input')}>
                                <Select
                                    id="status"
                                    name="status"
                                    size="large"
                                    placeholder="Vui lòng chọn"
                                    style={{ width: '100%' }}
                                    popupClassName={cx('form-popup')}
                                    value={formik.values.status || null}
                                    onChange={(value) => formik.setFieldValue('status', value)}
                                    onBlur={formik.handleBlur}
                                    options={billStatus}
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
