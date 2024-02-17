//react
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//Style
import Style from './Checkouts.module.scss';
import classNames from 'classnames/bind';
//mui ui
import { Chip, FormHelperText } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faClipboardCheck, faCreditCard, faLocationDot, faUserPen } from '@fortawesome/free-solid-svg-icons';
//component
import images from '~/assets';
import useAuth from '~/hooks/useAuth';
import Breadcrumb from '~/components/Breadcrumb';
import MoneyDisplay from '~/components/MoneyDisplay';

import { toast } from 'react-toastify';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { Input, Radio } from 'antd';
import { saveOrder } from '~/services/billService';
import { LoadingButton } from '@mui/lab';
import { getAddresses } from '~/services/addressService';
import DialogCreateAddress from '../Address/DialogCreateAddress';

const cx = classNames.bind(Style);
const { TextArea } = Input;

const DELIVERY_FEE = 30000;

const defaultValue = {
    consigneeName: '',
    phoneNumber: '',
    email: '',
    shippingAddress: '',
    paymentMethod: '',
    note: '',
    listProductId: [],
}

const validationSchema = yup.object({
    consigneeName: yup.string()
        .required('Họ tên người nhận không được để trống'),
    phoneNumber: yup.string()
        .required('Số điện thoại không được để trống'),
    email: yup.string()
        .email('Địa chỉ email không hợp lệ').required('Email không được để trống'),
    shippingAddress: yup.string()
        .required('Địa chỉ không được để trống'),
    note: yup.string()
        .max(30, 'Ghi chú tối đa 30 kí tự'),
    listProductId: yup.array()
        .min(1, 'Danh sách sản phẩm không được để trống'),
});

function inputProps(isError) {
    if (isError) {
        return { status: 'error' };
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

    const { isAuthenticated, customer } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const listProducts = useMemo(() => {
        return location.state?.listProducts || [];
    }, [location.state]);

    const [openAlertDialog, setOpenAlertDialog] = useState(false);

    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [addressList, setAddressList] = useState(null);
    const [defaultAddress, setDefaultAddress] = useState({});


    const formik = useFormik({
        initialValues: defaultValue,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    const handleSubmit = (values) => {
        setIsLoading(true);
        saveOrder(values)
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
        getAddresses()
            .then((response) => {
                const addresses = response.data.data;
                setAddressList(addresses);
                setDefaultAddress(addresses.find((address) => address.defaultAddress));
            })
            .catch((error) => {
                toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        formik.setValues({
            consigneeName: customer.fullName,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
            shippingAddress: customer.address,
            paymentMethod: 'CASH',
            note: '',
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

    useEffect(() => {
        if (isAuthenticated && addressList && addressList.length === 0) {
            setOpenAlertDialog(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addressList]);

    const handleCloseDialog = () => {
        navigate('/cart', { replace: true });
    };

    return (
        <>
            <DialogCreateAddress
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                onClose={handleCloseDialog}
                titleDescription={'Để đặt hàng, vui lòng thêm địa chỉ nhận hàng'}
            />
            <Breadcrumb
                breadcrumbs={[{ url: '/cart', label: 'Giỏ hàng của bạn' }]}
                currentPage={'Thanh toán'}
            />
            <div className='container'>
                <div className='row g-3'>
                    <div className='col-7'>
                        <div className='row g-3'>
                            <div className='col-12'>
                                {isAuthenticated && defaultAddress ? (
                                    <div className={cx('wrapper')}>
                                        <div className={cx('title')}>
                                            <div className='left'>
                                                <span className={cx('icon')}><FontAwesomeIcon icon={faLocationDot} /></span>
                                                <span>Địa chỉ nhận hàng</span>
                                            </div>
                                            {addressList && addressList.length > 0 &&
                                                <div className='right'>
                                                    <button className={cx('change-address')}>Thay đổi <FontAwesomeIcon icon={faCaretRight} /></button>
                                                </div>
                                            }
                                        </div>
                                        <div className={cx('inner')}>
                                            <div className={cx('current-address')}>
                                                <div className={cx('header')}>
                                                    <span>{defaultAddress.fullName}</span>
                                                    <span> | </span>
                                                    <span>{defaultAddress.phoneNumber}dasdasda</span>
                                                </div>
                                                <div className={cx('address-container')}>
                                                    {defaultAddress.defaultAddress && <Chip label='Mặc định' color='primary' size='small' sx={{ mr: 1 }} />}
                                                    <div>{defaultAddress.addressName}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    customerInfo(formik, handleClickOpen)
                                )}
                            </div>
                            <div className='col-12'>
                                <div className={cx('wrapper')}>
                                    <div className={cx('title')}>
                                        <div className='left'>
                                            <span className={cx('icon')}><FontAwesomeIcon icon={faCreditCard} /></span>
                                            <span>Phương thức thanh toán</span>
                                        </div>
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
                        <div className='row g-3'>
                            <div className='col-12'>
                                <div className={cx('wrapper')}>
                                    <div className={cx('title')}>
                                        <div className='left'>
                                            <span className={cx('icon')}><FontAwesomeIcon icon={faClipboardCheck} /></span>
                                            <span>Thông tin đơn hàng</span>
                                        </div>
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
                                        <TextArea
                                            id='note'
                                            name='note'
                                            rows={3}
                                            maxLength={30}
                                            placeholder='Thêm ghi chú'
                                            value={formik.values.note}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            {...inputProps(formik.touched.note && Boolean(formik.errors.note))}
                                            style={{ resize: 'none', }}
                                        />
                                        {formik.touched.note && formik.errors.note && (
                                            <FormHelperText error>{formik.errors.note}</FormHelperText>
                                        )}
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

function customerInfo(formik, handleClickOpen) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <div className='left'>
                    <span className={cx('icon')}><FontAwesomeIcon icon={faUserPen} /></span>
                    <span> Thông tin khách hàng</span>
                </div>
            </div>
            <div className={cx('inner')}>
                <div className={cx('form-group')}>
                    <label htmlFor='input-consigneeName'>HỌ TÊN NGƯỜI NHẬN</label>
                    <div className={cx('form-input')}>
                        <Input
                            id='input-consigneeName'
                            name='consigneeName'
                            size='large'
                            placeholder='Họ tên người nhận'
                            value={formik.values.consigneeName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            {...inputProps(formik.touched.consigneeName && Boolean(formik.errors.consigneeName))}
                        />
                        {formik.touched.consigneeName && formik.errors.consigneeName && (
                            <FormHelperText error>{formik.errors.consigneeName}</FormHelperText>
                        )}
                    </div>
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor='input-phone-number'>SỐ ĐIỆN THOẠI</label>
                    <div className={cx('form-input')}>
                        <Input
                            id='input-phone-number'
                            name='phoneNumber'
                            size='large'
                            placeholder='Số điện thoại liên hệ khi giao hàng'
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
                    <label htmlFor='input-shippingAddress'>ĐỊA CHỈ</label>
                    <div className={cx('form-input')}>
                        <Input
                            id='input-shippingAddress'
                            name='shippingAddress'
                            size='large'
                            placeholder='Nhập số nhà, tên đường'
                            value={formik.values.shippingAddress}
                            onClick={handleClickOpen}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            {...inputProps(formik.touched.shippingAddress && Boolean(formik.errors.shippingAddress))}
                        />
                        {formik.touched.shippingAddress && formik.errors.shippingAddress && (
                            <FormHelperText error>{formik.errors.shippingAddress}</FormHelperText>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkouts;