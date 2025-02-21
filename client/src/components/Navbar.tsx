import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupModal from "./signupModal";

// Material UI imports
import { AppBar, Toolbar, Menu, MenuItem, Button, Box, Avatar, TextField } from "@mui/material";


interface NavbarProps {
  logo?: string;
  logoSize?: number;
  links?: { label: string; path: string }[];
  user?: { name: string; avatar?: string } | null;
  onLogout?: () => void;
  onLogin: () => void; // Add onLogin prop
}

const Navbar: React.FC<NavbarProps> = ({ logo, logoSize = 50, links = [], user, onLogout, onLogin }) => {
  const [dashboardMenuEl, setDashboardMenuEl] = useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
 
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    setDashboardMenuEl(null); // Close menu after navigating
  };

  const handleLogout = () => {
    onLogout && onLogout();
    setDashboardMenuEl(null); // Close menu after
    navigate("/"); // Redirect to home page
  }
    
  

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {logo && <img src={logo} alt="Logo" style={{ height: logoSize, width: "auto", marginRight: 10 }} />}
          <TextField color="secondary" label="Book Search" id="searchBar" sx={{ width: "300px"}} />
        </Box>       

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {links.map((link, index) => (
            <Button key={index} color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate(link.path)}>
              {link.label}
            </Button>
          ))}

          {/* SHOW DASHBOARD ONLY IF LOGGED IN */}
          {user && (
            <>
              <Button 
                color="inherit"
                sx={{ marginRight: 2 }}
                onClick={(e) => setDashboardMenuEl(e.currentTarget)}
                aria-controls={dashboardMenuEl ? "dashboard-menu" : undefined}
                aria-haspopup="true"
              >
                Dashboard
              </Button>
              <Menu
                id="dashboard-menu"
                anchorEl={dashboardMenuEl}
                open={Boolean(dashboardMenuEl)}
                onClose={() => setDashboardMenuEl(null)}
              >                
                <MenuItem onClick={() => handleNavigate("/shelf")}>My Shelf</MenuItem>
                <MenuItem onClick={() => handleNavigate("/account")}>My Account</MenuItem>
                <MenuItem onClick={() => handleNavigate("/challenges")}>Challenges</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}

          {!user ? (
            <Button color="inherit" onClick={() => setModalOpen(true)}>Login/Signup</Button>
          ) : (
            <Avatar src={user.avatar || undefined} alt={user.name || "User"} sx={{ marginLeft: 0, height: 60, width: 60}} />
          )}
        </Box>
      </Toolbar>
      <SignupModal open={modalOpen} onClose={() => setModalOpen(false)} onLogin={onLogin} />
    </AppBar>
  );
};

export default Navbar;
