import LocationSelector from './LocationSelector';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function ShowDialog({ openAlertDialog: open, setOpenAlertDialog: setOpen, setSelectedAddress }) {

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

export default ShowDialog;