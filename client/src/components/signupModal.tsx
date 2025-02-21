import * as React from "react";

// Material UI imports
import { Box, Button, Typography, Modal, TextField, Tabs, Tab } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void; // Receive mock login function
}

export default function SignupModal({ open, onClose, onLogin }: SignupModalProps) {
  const [tab, setTab] = React.useState(0); // 0 = Login, 1 = Signup

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleMockLogin = () => {
    onLogin(); // Call mock login function
    onClose(); // Close modal after login
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="auth-modal-title">
      <Box sx={style}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        <Typography id="auth-modal-title" variant="h6" textAlign="center">
          {tab === 0 ? "Login to Your Account" : "Create an Account"}
        </Typography>

        {tab === 0 && (
          <>
            <TextField fullWidth label="Email" name="email" type="email" variant="outlined" required />
            <TextField fullWidth label="Password" name="password" type="password" variant="outlined" required />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>

            {/* Mock Login Button */}
            <Button 
              variant="outlined" 
              color="secondary" 
              fullWidth 
              sx={{ mt: 2, backgroundColor: "primary.main" }} 
              onClick={handleMockLogin} // Call mock login function
            >
              Mock Login
            </Button>
          </>
        )}

        {tab === 1 && (
          <>
            <TextField fullWidth label="Name" name="name" variant="outlined" required />
            <TextField fullWidth label="Email" name="email" type="email" variant="outlined" required />
            <TextField fullWidth label="Password" name="password" type="password" variant="outlined" required />
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Sign Up
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}
