//react
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

//Style
import Style from './Checkouts.module.scss';
import classNames from 'classnames/bind';

//mui ui
import { Chip, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faClipboardCheck, faCreditCard, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Input, Radio } from 'antd';

//component
import images from '~/assets';
import useAuth from '~/hooks/useAuth';
import Breadcrumb from '~/components/Breadcrumb';
import MoneyDisplay from '~/components/MoneyDisplay';


import * as yup from 'yup';
import { useFormik } from 'formik';

import { saveOrder } from '~/services/billService';
import { getAddresses } from '~/services/addressService';

import DialogCreateAddress from '../Address/DialogCreateAddress';
import DialogSelectAddress from '../Address/DialogSelectAddress';

const cx = classNames.bind(Style);
const { TextArea } = Input;

const DELIVERY_FEE = 30000;

const defaultValue = {
    addressDetailId: null,
    paymentMethod: "CASH",
    note: "",
    listProductId: []
}

const validationSchema = yup.object({
    addressDetailId: yup.number(),
    paymentMethod: yup.string(),
    note: yup.string()
        .max(30, 'Ghi chú tối đa 30 kí tự'),
    listProductId: yup.array()
        .min(1, 'Danh sách sản phẩm không được để trống'),
});

function inputProps(isError) {
    if (isError) { return { status: 'error' }; }
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

    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const listProducts = useMemo(() => {
        return location.state?.listProducts || [];
    }, [location.state]);

    const [openAlertDialog, setOpenAlertDialog] = useState(false);
    const [isOpenDialogSelectAddress, setIsOpenDialogSelectAddress] = useState(false);

    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [addressList, setAddressList] = useState(null);
    const [addressSelect, setAddressSelect] = useState(null);

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

    const onChangePaymentMethods = (e) => {
        setPaymentMethods(e.target.value);
    };

    const fetchListAddress = () => {
        getAddresses()
            .then((response) => {
                const addresses = response.data.data;
                setAddressList(addresses);
                if (addresses.length > 0) {
                    const addressDefault = addresses[0];
                    setAddressSelect(addressDefault)
                    formik.setFieldValue('addressDetailId', addressDefault.id);
                }
            })
            .catch((error) => {
                toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
            })
    }
    useEffect(() => {
        fetchListAddress();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        formik.setValues((values) => ({
            ...values,
            listProductId: listProducts.map(item => item.productId)
        }))
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
        navigate('/cart', { replace: true, state: { productIdSelect: formik.values.listProductId } });
    };

    const handleChangeAddress = (addressDetailId) => {
        formik.setFieldValue("addressDetailId", addressDetailId)
        const newAddressSelect = addressList.find(address => address.id === Number(addressDetailId))
        if (newAddressSelect) {
            setAddressSelect(newAddressSelect);
        }
    };

    return (
        <>
            <Breadcrumb
                breadcrumbs={[{ url: '/cart', label: 'Giỏ hàng của bạn' }]}
                currentPage={'Thanh toán'}
            />
            <DialogSelectAddress
                open={isOpenDialogSelectAddress}
                setOpen={setIsOpenDialogSelectAddress}
                addressList={addressList}
                defaultValue={formik.values.addressDetailId}
                title={'Địa Chỉ Của Tôi'}
                onSubmit={handleChangeAddress}
                fetchListAddress={fetchListAddress}
            />
            <DialogCreateAddress
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                onClose={handleCloseDialog}
                onSuccess={fetchListAddress}
                title={'Địa chỉ mới'}
                titleDescription={'Để đặt hàng, vui lòng thêm địa chỉ nhận hàng'}
                defaultAddress={addressList && addressList.length === 0}
            />
            <div className='container'>
                <div className='row g-3'>
                    <div className='col-7'>
                        <div className='row g-3'>
                            <div className='col-12'>
                                {isAuthenticated && addressList && addressList.length > 0 ? (
                                    <div className={cx('wrapper')}>
                                        <div className={cx('title')}>
                                            <div className='left'>
                                                <span className={cx('icon')}><FontAwesomeIcon icon={faLocationDot} /></span>
                                                <span>Địa chỉ nhận hàng</span>
                                            </div>
                                            {addressList && addressList.length > 0 &&
                                                <div className='right'>
                                                    <button
                                                        className={cx('change-address')}
                                                        onClick={() => setIsOpenDialogSelectAddress(true)}
                                                    >
                                                        Thay đổi
                                                        <FontAwesomeIcon icon={faCaretRight} />
                                                    </button>
                                                </div>
                                            }
                                        </div>
                                        <div className={cx('inner')}>
                                            <div className={cx('current-address')}>
                                                <div className={cx('header')}>
                                                    <span>{addressSelect.fullName}</span>
                                                    <span> | </span>
                                                    <span>{addressSelect.phoneNumber}</span>
                                                </div>
                                                <div className={cx('address-container')}>
                                                    {addressSelect.defaultAddress && <Chip label='Mặc định' color='primary' size='small' sx={{ mr: 1 }} />}
                                                    <div>{addressSelect.addressName}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <></>
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

export default Checkouts;