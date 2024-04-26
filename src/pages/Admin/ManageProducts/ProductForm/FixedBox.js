import { useState, useEffect } from 'react';

import Style from './ProductForm.module.scss';
import classNames from 'classnames/bind';
import AlertDialog from '~/components/Common/AlertDialog';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';

const cx = classNames.bind(Style);

function FixedBox({ handleSubmit, loading }) {

    const navigate = useNavigate();
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = window.innerHeight + window.scrollY;
            const documentHeight = document.body.offsetHeight;

            setIsAtBottom(scrollHeight >= documentHeight);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleClose = () => {
        navigate('/admin/product', { replace: true });
    }

    return (
        <>
            <AlertDialog
                open={showDialog}
                setOpen={setShowDialog}
                title={'Xác nhận'}
                description={'Hủy thay đổi'}
                handleSubmit={handleClose}
            />
            <div className={cx('fixed-box', { 'fixed-botom': !isAtBottom })}>
                <div className={cx('btn-group')}>
                    <Button variant="outlined" onClick={() => setShowDialog(true)}>Hủy</Button>
                    <LoadingButton
                        onClick={() => handleSubmit()}
                        loading={loading}
                        variant="contained"
                    >
                        <span>Lưu</span>
                    </LoadingButton>
                </div>
            </div>
            <div className={cx('fix-placeholder', { 'hide': isAtBottom })}></div>
        </>
    );
};

export default FixedBox;
