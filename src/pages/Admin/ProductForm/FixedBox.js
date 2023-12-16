import { useState, useEffect } from 'react';

import Style from './ProductForm.module.scss';
import classNames from 'classnames/bind';
import AlertDialog from '~/components/AlertDialog';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(Style);

function FixedBox({ handleSubmit }) {

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
        navigate('/admin/products', { replace: true });
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
                    <button type='button' className='btn btn-secondary' onClick={() => setShowDialog(true)}>Hủy</button>
                    <button type='submit' className='btn btn-primary' onClick={() => handleSubmit()}>Lưu</button>
                </div>
            </div>
            <div className={cx('fix-placeholder', { 'hide': isAtBottom })}></div>
        </>
    );
};

export default FixedBox;
