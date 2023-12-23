import PropTypes from 'prop-types';

import LocationSelector from './LocationSelector';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function ShowDialog({ open, setOpen, setSelectedAddress }) {

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">Địa chỉ mới</DialogTitle>
                <DialogContent>
                    <LocationSelector onSelectAddress={handleSelectAddress} onClose={handleClose} />
                </DialogContent>
            </Dialog>
        </>
    );
}

ShowDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    setSelectedAddress: PropTypes.func.isRequired,
};

export default ShowDialog;