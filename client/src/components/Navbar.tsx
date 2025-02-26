import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupModal from "./signupModal";

// Material UI imports
import { AppBar, Toolbar, Menu, MenuItem, Button, Box, Avatar, TextField, useMediaQuery, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Auth from '../utils/auth'

interface NavbarProps {
  logo?: string;
  logoSize?: number;
  links?: { label: string; path: string }[];
  // user?: { name: string; avatar?: string } | null;
  // onLogout?: () => void;
  // onLogin: () => void; // Add onLogin prop
}

const Navbar: React.FC<NavbarProps> = ({ logo, logoSize = 50, links = [] }) => {
  const [dashboardMenuEl, setDashboardMenuEl] = useState<null | HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // const [loggedIn, setLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const[mobileOpen, setMobileOpen] = useState(false);

 
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 906px)");

  const handleNavigate = (path: string) => {
    navigate(path);
    setDashboardMenuEl(null); // Close menu after navigating
    setMobileOpen(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/book-search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = () => {
    setDashboardMenuEl(null); // Close menu after
    Auth.logout();
    navigate("/"); // Redirect to home page
  }
  if (Auth.loggedIn()) {
    const user = Auth.getProfile();
    console.log(user);
  }

  Auth.isAdmin();

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

      
        {isMobile && (
          <IconButton color="inherit" onClick={() => setMobileOpen(true)} sx={{ marginRight: 2 }}>
            <MenuIcon />
          </IconButton>
        )}

        
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center'}}>
          {logo && <img src={logo} alt="Logo" style={{ height: logoSize, width: "auto", marginRight: 10 }} />}
          {!isMobile && (
            <form onSubmit={handleSearch}>
              <TextField
                color="secondary"
                label="Book Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: "300px", marginRight: "10px" }}
              />
              <Button type="submit" variant="contained" color="secondary">
                Search
              </Button>
              <Button
                color="secondary"
                sx={{ marginTop: 1, textTransform: "none" }}
                onClick={() => navigate("/book-search")}
              >
                Advanced Search
              </Button>
            </form>
          )}
        </Box>

        
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {links.map((link, index) => (
              <Button key={index} color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate(link.path)}>
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {Auth.loggedIn() && !Auth.isAdmin() && (
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
              </Menu>
            </>
          )}

          {Auth.loggedIn() && Auth.isAdmin() && (
            <>
              <Button 
                color="inherit"
                sx={{ marginRight: 2 }}
                onClick={(e) => setDashboardMenuEl(e.currentTarget)}
                aria-controls={dashboardMenuEl ? "dashboard-menu" : undefined}
                aria-haspopup="true"
              >
                Admin
              </Button>
              <Menu
                id="dashboard-menu"
                anchorEl={dashboardMenuEl}
                open={Boolean(dashboardMenuEl)}
                onClose={() => setDashboardMenuEl(null)}
              >                
                <MenuItem onClick={() => handleNavigate("/manageusers")}>Manage Users</MenuItem>
              </Menu>
            </>
          )}
  
          {Auth.loggedIn() ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                LOGOUT
              </Button>
              <Avatar sx={{ marginLeft: 1, height: 50, width: 50 }} />
            </>
          ) : (
            <Button color="inherit" onClick={() => setModalOpen(true)}>Login/Signup</Button>
          )}
        </Box>
      </Toolbar>

     
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
          <List sx={{ width: 250 }}>
            {links.map((link, index) => (
              <ListItem component={Button} key={index} onClick={() => handleNavigate(link.path)}>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            {Auth.loggedIn() && (
              Auth.isAdmin() ? (
                <ListItem component={Button} onClick={() => handleNavigate("/manageusers")}>
                  <ListItemText primary="Manage Users" />
                </ListItem>
              ) : (
                <>
                  <ListItem component={Button} onClick={() => handleNavigate("/shelf")}>
                    <ListItemText primary="My Shelf" />
                  </ListItem>
                  <ListItem component={Button} onClick={() => handleNavigate("/account")}>
                    <ListItemText primary="My Account" />
                  </ListItem>
                  <ListItem component={Button} onClick={() => handleNavigate("/challenges")}>
                    <ListItemText primary="Challenges" />
                  </ListItem>
                </>
              )
            )}
            {Auth.loggedIn() && (
              <ListItem component={Button} onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>
            )}
            {!Auth.loggedIn() && (
              <ListItem component={Button} onClick={() => setModalOpen(true)}>
                <ListItemText primary="Login/Signup" />
              </ListItem>
            )}
          </List>
        </Drawer>
      )}

      <SignupModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </AppBar>
  );
};

export default Navbar;
