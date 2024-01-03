//react
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//Style
import Style from './Checkouts.module.scss';
import classNames from 'classnames/bind';
//mui ui
import { Button, FormHelperText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faCreditCard, faUserPen } from '@fortawesome/free-solid-svg-icons';
//component
import images from '~/assets';
import useAuth from '~/hooks/useAuth';
import Breadcrumb from '~/components/Breadcrumb';
import MoneyDisplay from '~/components/MoneyDisplay';

import { toast } from 'react-toastify';
import ShowDialog from '../Address/ShowDialog';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { Input, Radio } from 'antd';
import { orderFromCart } from '~/services/billService';
import { LoadingButton } from '@mui/lab';

const cx = classNames.bind(Style);
const { TextArea } = Input;

const DELIVERY_FEE = 30000;

const defaultValue = {
    nameCustomer: '',
    phonenumber: '',
    email: '',
    address: '',
    listProductId: [],
}

const validationSchema = yup.object({
    nameCustomer: yup.string()
        .required('Họ tên người nhận không được để trống'),
    phonenumber: yup.string()
        .required('Số điện thoại không được để trống'),
    email: yup.string()
        .email('Địa chỉ email không hợp lệ').required('Email không được để trống'),
    address: yup.string()
        .required('Địa chỉ không được để trống'),
});

function inputProps(isError) {
    if (isError) {
        return {
            status: 'error'
        };
    }
}

const PAYMENT_METHODS = [
    {
        value: 1,
        label: 'Thanh toán khi giao hàng (COD)',
        img: images.payment[0],
        alt: 'cod',
    },
    {
        value: 2,
        label: 'Ví MoMo',
        img: images.payment[1],
        alt: 'momo',
    },
    {
        value: 3,
        label: 'Ví Zalopay bằng QRCode',
        img: images.payment[2],
        alt: 'zalo',
    }
]

function Checkouts() {

    const navigate = useNavigate();
    const location = useLocation();
    const { user, customer } = useAuth();

    const listProducts = useMemo(() => {
        return location.state?.listProducts || [];
    }, [location.state]);

    const [openAlertDialog, setOpenAlertDialog] = useState(false);

    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleSubmit = (values) => {
        setIsLoading(true);
        orderFromCart(customer.customerId, values)
            .then((response) => {
                navigate('/purchase', { replace: true });
            })
            .catch((error) => {
                toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
            })
            .finally(() => { setIsLoading(false); });
    }

    const handleClickOpen = () => {
        setOpenAlertDialog(true);
    };

    const onChangePaymentMethods = (e) => {
        setPaymentMethods(e.target.value);
    };

    useEffect(() => {
        formik.setValues({
            nameCustomer: customer.name,
            phonenumber: customer.phonenumber,
            email: user.email,
            address: customer.address,
            listProductId: listProducts.map(item => item.productId)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listProducts]);

    useEffect(() => {
        const totalPrice = listProducts.reduce((sum, product) => {
            return sum + product.quantity * (product.price * (100 - product.discount) / 100);
        }, 0);
        setTotalPrice(totalPrice);
    }, [listProducts]);

    useEffect(() => {
        if (listProducts.length === 0) {
            navigate('/', { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listProducts]);

    return (
        <>
            <ShowDialog
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                setSelectedAddress={(address) => {
                    formik.setFieldValue('address', address);
                }}
            />
            <Breadcrumb
                breadcrumbs={[{ url: '/cart', label: 'Giỏ hàng của bạn' }]}
                currentPage={'Thanh toán'}
            />
            <div className='container'>
                <div className='row g-2'>
                    <div className='col-7'>
                        <div className='row g-2'>
                            <div className='col-12'>
                                <div className={cx('wrapper')}>
                                    <div className={cx('title')}>
                                        <span className={cx('icon')}><FontAwesomeIcon icon={faUserPen} /></span>
                                        <span> Thông tin khách hàng</span>
                                    </div>
                                    <div className={cx('inner')}>
                                        <div className={cx('form-group')}>
                                            <label htmlFor='input-name'>HỌ TÊN NGƯỜI NHẬN</label>
                                            <div className={cx('form-input')}>
                                                <Input
                                                    id='input-name'
                                                    name='nameCustomer'
                                                    size='large'
                                                    placeholder='Họ tên người nhận'
                                                    value={formik.values.nameCustomer}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    {...inputProps(formik.touched.nameCustomer && Boolean(formik.errors.nameCustomer))}
                                                />
                                                {formik.touched.nameCustomer && formik.errors.nameCustomer && (
                                                    <FormHelperText error>{formik.errors.nameCustomer}</FormHelperText>
                                                )}
                                            </div>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label htmlFor='input-phone-number'>SỐ ĐIỆN THOẠI</label>
                                            <div className={cx('form-input')}>
                                                <Input
                                                    id='input-phone-number'
                                                    name='phonenumber'
                                                    size='large'
                                                    placeholder='Số điện thoại liên hệ khi giao hàng'
                                                    value={formik.values.phonenumber}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    {...inputProps(formik.touched.phonenumber && Boolean(formik.errors.phonenumber))}
                                                />
                                                {formik.touched.phonenumber && formik.errors.phonenumber && (
                                                    <FormHelperText error>{formik.errors.phonenumber}</FormHelperText>
                                                )}
                                            </div>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <label htmlFor='input-email'>EMAIL</label>
                                            <div className={cx('form-input')}>
                                                <Input
                                                    id='input-email'
                                                    name='email'
                                                    size='large'
                                                    placeholder='Email nhận đơn hàng'
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
                                            <label htmlFor='input-address'>ĐỊA CHỈ</label>
                                            <div className={cx('form-input')}>
                                                <Input
                                                    id='input-address'
                                                    name='address'
                                                    size='large'
                                                    placeholder='Nhập số nhà, tên đường'
                                                    value={formik.values.address}
                                                    onClick={handleClickOpen}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    {...inputProps(formik.touched.address && Boolean(formik.errors.address))}
                                                />
                                                {formik.touched.address && formik.errors.address && (
                                                    <FormHelperText error>{formik.errors.address}</FormHelperText>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className={cx('wrapper')}>
                                    <div className={cx('title')}>
                                        <span className={cx('icon')}><FontAwesomeIcon icon={faCreditCard} /></span>
                                        <span>Phương thức thanh toán</span>
                                    </div>
                                    <div className={cx('inner')}>
                                        <Radio.Group onChange={onChangePaymentMethods} value={paymentMethods} style={{ width: '100%' }}>
                                            {PAYMENT_METHODS.map((item, index) => {
                                                return (
                                                    <div key={index} className={cx('payment-item', paymentMethods !== item.value ? 'disabled' : '')}>
                                                        <Radio value={item.value} style={{ width: '100%' }}>
                                                            <img className={cx('payment-item-img')} src={item.img} alt={item.alt} />
                                                            <span className={cx('payment-item-text')}>{item.label}</span>
                                                        </Radio>
                                                    </div>
                                                )
                                            })}
                                        </Radio.Group>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-5'>
                        <div className='row g-2'>
                            <div className='col-12'>
                                <div className={cx('wrapper')}>
                                    <div className={cx('title')}>
                                        <span className={cx('icon')}><FontAwesomeIcon icon={faClipboardCheck} /></span>
                                        <span>Thông tin đơn hàng</span>
                                    </div>
                                    <div className={cx('inner')}>
                                        {listProducts.map((product, index) => {
                                            return (
                                                <div key={index} className={cx('product-item')} >
                                                    <img className={cx('product-image')} src={product.image} alt={product.name} />
                                                    <div className={cx('product-description')}>
                                                        <span className={cx('product-name')}> {product.name}</span>
                                                        <div>
                                                            <span className={cx('discounted-price')}>
                                                                <MoneyDisplay amount={product.price * (100 - product.discount) / 100} />
                                                            </span>
                                                            <span className={cx('original-price')}>
                                                                <MoneyDisplay amount={product.price} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={cx('product-quantity')}>
                                                        X
                                                        {product.quantity}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <TextArea rows={3} placeholder="Thêm ghi chú" maxLength={6} />
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div className={cx('wrapper')}>
                                    <div className={cx('checkout')}>
                                        <div className={cx('bill-total-cost')}>
                                            <div className={cx('order-detail')}>
                                                <span>Tiền hàng</span>
                                                <span className={cx('price')}>
                                                    <MoneyDisplay amount={totalPrice} />
                                                </span>
                                            </div>
                                            <div className={cx('order-detail')}>
                                                <span>Phí giao hàng</span>
                                                <span className={cx('price')}>
                                                    <MoneyDisplay amount={DELIVERY_FEE} />
                                                </span>
                                            </div>
                                        </div>
                                        <div className={cx('total-and-submit')}>
                                            <div className={cx('total-cost')}>
                                                <span>Tổng thanh toán</span>
                                                <span className={cx('total-price')}>
                                                    <MoneyDisplay amount={totalPrice + DELIVERY_FEE} />
                                                </span>
                                            </div>
                                            <LoadingButton
                                                fullWidth
                                                variant='contained'
                                                loading={isLoading}
                                                onClick={formik.handleSubmit}
                                            >
                                                <span>Đặt mua</span>
                                            </LoadingButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkouts;