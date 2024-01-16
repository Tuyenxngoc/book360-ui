import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as yup from 'yup';
import { useFormik } from 'formik';

import { customerUpload } from '~/services/customerService';
import { createBanner, getBanner } from '~/services/bannerService';
import { routes } from '~/config';

import Style from './MagageOrders.module.scss';
import classNames from 'classnames/bind';

import { Input } from 'antd';
import { message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Button, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AlertDialog from '~/components/AlertDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-regular-svg-icons';
import { faArrowLeft, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { getBillInfo, getBillsByCustomerId } from '~/services/billService';
import Product from '~/components/Product';
import MoneyDisplay from '~/components/MoneyDisplay';

const { Dragger } = Upload;

const cx = classNames.bind(Style);

function OrderForm() {

    const { orderId } = useParams();
    const [data, setData] = useState();
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        if (orderId) {
            getBillInfo(orderId)
                .then((response) => {
                    setData(response.data.data);
                })
                .catch((error) => { console.log(error); })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    if (!data) {
        return <></>
    }

    return (
        <div className='container my-3'>
            <div className='row justify-content-center gy-3'>
                <div className='col-10'>
                    <div className={cx('panel-wrapper')}>
                        <div className='panel-content'>
                            {data.status}
                        </div>
                    </div>
                </div>

                <div className='col-10'>
                    <div className={cx('panel-wrapper')}>
                        <div className='panel-content'>
                            Mã đơn hàng   {data.id}
                            <br />
                            Địa chỉ nhận hàng {data.customer.address}
                            <br />
                            Người nhận hàng {data.customer.nickName}
                        </div>
                    </div>
                </div>

                <div className='col-10'>
                    <div className={cx('panel-wrapper')}>
                        <div className='panel-content'>
                            <table className="table align-middle mb-0">
                                <thead className='table-light'>
                                    <tr>
                                        <th scope="col">STT</th>
                                        <th scope="col">Sản phẩm</th>
                                        <th scope="col">Đơn giá</th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.billDetail.map((item, index) => {
                                        const { product, quantity } = item;
                                        return (
                                            <tr key={index}>
                                                <th scope="row" align='center'>{index + 1}</th>
                                                <td align='left'>
                                                    <div className={cx('product-item')}>
                                                        <div className={cx('product-image')}>
                                                            <img src={product.featuredImage} alt='featuredImage' />
                                                        </div>
                                                        <div className='product-detail'>
                                                            <div className={cx('product-name')}>{product.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td align='left'>
                                                    <MoneyDisplay amount={product.price} />
                                                </td>
                                                <td align='left'>{quantity}</td>
                                                <td align='right'>
                                                    <MoneyDisplay amount={product.price} discountPercent={product.discount} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className={cx('footer')}>
                                        <td align='right' colSpan='3'>Tổng tiền sản phẩm</td>
                                        <td align='right' colSpan='2'>
                                            <MoneyDisplay amount={data.total} />
                                        </td>
                                    </tr>
                                    <tr className={cx('footer')}>
                                        <td align='right' colSpan='3'>Phí vận chuyển</td>
                                        <td align='right' colSpan='2'>
                                            <MoneyDisplay amount={data.feeShip} />
                                        </td>
                                    </tr>
                                    <tr className={cx('footer')}>
                                        <td align='right' colSpan='3'>Doanh Thu Đơn Hàng</td>
                                        <td align='right' colSpan='2'>
                                            <span className={cx('total-price')}>
                                                <MoneyDisplay amount={data.total - data.feeShip} />
                                            </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderForm;