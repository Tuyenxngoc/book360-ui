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

    return (
        <div className='container my-3'>
            <div className='row justify-content-center gy-3'>
                <div className='col-10'>
                    <div className={cx('panel-wrapper')}>
                        <div className={cx('panel-header')}>
                            <div className={cx('panel-title')}>
                                <FontAwesomeIcon icon={faClipboard} className='me-3' />
                                Đã hủy
                            </div>
                        </div>
                        <div className='panel-content'>

                        </div>
                    </div>
                </div>

                <div className='col-10'>
                    <div className={cx('panel-wrapper')}>
                        <div className={cx('panel-header')}>
                            <div className={cx('panel-title')}>
                                <FontAwesomeIcon icon={faClipboard} className='me-3' />
                                {JSON.stringify(data)}
                            </div>
                        </div>
                        <div className='panel-content'>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderForm;