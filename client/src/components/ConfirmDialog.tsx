import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

//Defined interface for Argument types
interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

//Define the layout of Confirmation Dialog
const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onClose, onConfirm, message }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ backgroundColor: "#293FBC", color: "BLACK", textAlign: "center"}} >Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
