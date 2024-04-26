import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';

//Style
import Style from './Address.module.scss';
import classNames from 'classnames/bind';

import DialogCreateAddress from './DialogCreateAddress';

const cx = classNames.bind(Style);

function defaultFunction() {}

function DialogSelectAddress({
    open,
    setOpen,
    addressList = [],
    defaultValue,
    title,
    titleDescription,
    onSubmit = defaultFunction,
    fetchListAddress = defaultFunction,
}) {
    const [value, setValue] = useState(null);
    const [isOpenDialogCreateAddress, setIsOpenDialogCreateAddress] = useState(false);
    const [addressSelect, setAddressSelect] = useState(null);

    const handleBtnCancelClick = () => {
        setOpen(false);
    };

    const handleBtnOkClick = () => {
        onSubmit(value);
        setOpen(false);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleClickBtnCreate = () => {
        setIsOpenDialogCreateAddress(true);
        setOpen(false);
        setAddressSelect(null);
    };

    const handleClickBtnUpdate = (id) => {
        setIsOpenDialogCreateAddress(true);
        setOpen(false);
        setAddressSelect(id);
    };

    const handleCloseDialogCreateAddress = () => {
        setOpen(true);
    };

    const handleCreateAddressSuccess = () => {
        setOpen(true);
        fetchListAddress();
    };

    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

    return (
        <>
            <DialogCreateAddress
                open={isOpenDialogCreateAddress}
                setOpen={setIsOpenDialogCreateAddress}
                onClose={handleCloseDialogCreateAddress}
                onSuccess={handleCreateAddressSuccess}
                addressId={addressSelect}
            />
            <Dialog open={open} scroll="paper" disableEscapeKeyDown aria-labelledby="alert-dialog-title">
                <DialogTitle id="alert-dialog-title">
                    <div className={cx('title')}>{title}</div>
                    {titleDescription && <div className={cx('title-description')}>{titleDescription}</div>}
                </DialogTitle>
                <DialogContent dividers>
                    <RadioGroup aria-label="address" name="address" value={value} onChange={handleChange}>
                        {addressList.map((address) => (
                            <FormControlLabel
                                sx={{ mr: 0 }}
                                value={address.id}
                                key={address.id}
                                control={<Radio />}
                                label={
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <span>{address.fullName}</span>
                                                <span> | </span>
                                                <span>{address.phoneNumber}</span>
                                            </div>
                                            <div>
                                                <Button onClick={() => handleClickBtnUpdate(address.id)}>
                                                    Cập nhật
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <div>{address.fullAddress}</div>
                                            {address.isDefaultAddress && (
                                                <Chip label="Mặc định" color="primary" size="small" sx={{ mr: 1 }} />
                                            )}
                                        </div>
                                    </div>
                                }
                            />
                        ))}
                    </RadioGroup>
                    {addressList.length < 5 && (
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<FontAwesomeIcon icon={faPlus} />}
                            onClick={handleClickBtnCreate}
                            sx={{ mt: 2 }}
                        >
                            Thêm địa chỉ mới
                        </Button>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleBtnCancelClick}>
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={handleBtnOkClick}>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

DialogSelectAddress.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    addressList: PropTypes.array.isRequired,
    defaultValue: PropTypes.number,
    title: PropTypes.string.isRequired,
    titleDescription: PropTypes.string,
    onSubmit: PropTypes.func,
    fetchListAddress: PropTypes.func,
};

export default DialogSelectAddress;
