import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function AlertDialog({ open, setOpen, title, description, handleSubmit }) {
    const handleClose = () => {
        setOpen(false);
    };

    const handleBtnAgreeClick = () => {
        handleSubmit();
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" sx={{ fontSize: '18px', fontWeight: 400 }}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleBtnAgreeClick} autoFocus>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AlertDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
};

export default AlertDialog;
