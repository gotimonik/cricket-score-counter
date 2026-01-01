import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Are you sure?",
  content = "This action cannot be undone.",
  onClose,
  onConfirm,
  confirmText = "Yes",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          p: 2,
          minWidth: 340,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 900,
          color: '#185a9d',
          fontSize: 22,
          letterSpacing: 1,
          textAlign: 'center',
          pb: 0.5,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          color: '#185a9d',
          fontWeight: 600,
          fontSize: 16,
          textAlign: 'center',
          py: 2,
        }}
      >
        {content}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 1 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{
            borderRadius: 3,
            px: 3,
            fontWeight: 700,
            color: '#185a9d',
            border: '1.5px solid #185a9d',
            background: 'rgba(24,90,157,0.06)',
            mr: 1.5,
            boxShadow: 'none',
            ':hover': {
              background: 'rgba(24,90,157,0.13)',
              color: '#185a9d',
              border: '1.5px solid #185a9d',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{
            borderRadius: 3,
            px: 3,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
            color: '#fff',
            boxShadow: 'none',
            ':hover': {
              background: 'linear-gradient(90deg, #185a9d 0%, #43cea2 100%)',
              color: '#fff',
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
