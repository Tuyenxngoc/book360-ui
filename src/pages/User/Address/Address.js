import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Style from './Address.module.scss';
import classNames from 'classnames/bind';

import { deleteAddress, getAddresses, setDefaultAddress } from '~/services/addressService';

import { Button, Chip } from '@mui/material';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AlertDialog from '~/components/Common/AlertDialog';
import DialogCreateAddress from './DialogCreateAddress';

const cx = classNames.bind(Style);

function Address() {
    const [addressList, setAddressList] = useState([]);
    const [addressSelect, setAddressSelect] = useState(null);
    const [showDialogCreate, setShowDialogCreate] = useState(false);
    const [showDialogDelete, setShowDialogDelete] = useState(false);

    const handleCreateSuccess = () => {
        fetchListAddress();
    };

    const handleClickBtnCreate = () => {
        setShowDialogCreate(true);
        setAddressSelect(null);
    };

    const handleClickBtnDelete = (addressId) => {
        setShowDialogDelete(true);
        setAddressSelect(addressId);
    };

    const handleClickBtnUpdate = (addressId) => {
        setShowDialogCreate(true);
        setAddressSelect(addressId);
    };

    const handleDeleteAddress = () => {
        deleteAddress(addressSelect)
            .then((response) => {
                fetchListAddress();
            })
            .catch((error) => {
                toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
            });
    };

    const handleSetDefaultAddress = (id) => {
        setDefaultAddress(id)
            .then((response) => {
                fetchListAddress();
            })
            .catch((error) => {
                toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
            });
    };

    const fetchListAddress = () => {
        getAddresses()
            .then((response) => {
                const addresses = response.data.data;
                setAddressList(addresses);
            })
            .catch((error) => {
                toast.error('Đã có lỗi sảy ra, vui lòng thử lại sau');
            });
    };

    useEffect(() => {
        fetchListAddress();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('main-content')}>
            <div className="row">
                <div className="col-12">
                    <div className={cx('header')}>
                        <h3 className={cx('title')}>Địa chỉ của tôi</h3>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={handleClickBtnCreate}
                        >
                            Thêm địa chỉ mới
                        </Button>
                    </div>
                </div>
            </div>

            <div className="row pt-4">
                <div className="col-12">
                    <div className="pb-4">Bạn có thể tạo tối đa 5 địa chỉ</div>
                </div>
                <div className="col-12">
                    <AlertDialog
                        open={showDialogDelete}
                        setOpen={setShowDialogDelete}
                        title={'Bạn có chắc muốn xoá địa chỉ này?'}
                        handleSubmit={handleDeleteAddress}
                    />
                    <DialogCreateAddress
                        open={showDialogCreate}
                        setOpen={setShowDialogCreate}
                        addressId={addressSelect}
                        onSuccess={handleCreateSuccess}
                        title={addressSelect ? 'Cập nhật địa chỉ' : 'Địa chỉ mới'}
                    />
                    {addressList.map((address, index) => (
                        <div key={index} className={cx('address-container', 'container')}>
                            <div className="row">
                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{address.fullName}</span>
                                        <div>
                                            <Button size="small" onClick={() => handleClickBtnUpdate(address.id)}>
                                                Cập nhật
                                            </Button>
                                            {address.isDefaultAddress || (
                                                <Button size="small" onClick={() => handleClickBtnDelete(address.id)}>
                                                    Xóa
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span>{address.fullAddress}</span>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            disabled={address.isDefaultAddress}
                                            onClick={() => handleSetDefaultAddress(address.id)}
                                        >
                                            Thiết lập mặc định
                                        </Button>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div>Điện thoại:{address.phoneNumber}</div>
                                </div>

                                <div className="col-12">
                                    {address.isDefaultAddress && <Chip label="Mặc định" color="primary" size="small" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Address;
