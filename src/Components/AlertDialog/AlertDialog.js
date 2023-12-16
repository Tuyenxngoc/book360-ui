import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
            maxWidth={'xs'}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleBtnAgreeClick} autoFocus>Xác nhận</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AlertDialog;