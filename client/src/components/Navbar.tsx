import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupModal from "./signupModal";
import { ColorModeContext } from "../App";

// Material UI imports
import { AppBar, Toolbar, Menu, MenuItem, Button, Box, Avatar, TextField, useMediaQuery, Drawer, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogActions, DialogContent } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

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
  const [searchOpen, setSearchOpen] = useState(false);
  const[mobileOpen, setMobileOpen] = useState(false);

  const { mode, toggleColorMode } = useContext(ColorModeContext);
 
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
      const searchUrl = `/book-search?query=${encodeURIComponent(searchTerm)}`;
  
      if (location.pathname === "/book-search") {
        navigate(searchUrl, { replace: true }); // Replace the current URL
        window.location.reload(); // Reload the page to trigger a new search
      } else {
        navigate(searchUrl);
      }
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

  //Call the isAdmin function to know if the user that is logged in is Admin or a Regular User
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
          {/* Display Search Text box and Button only for Regular Users  */}
          {!isMobile && !Auth.isAdmin() && (
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
            </form>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {isMobile && (
            <IconButton color="inherit" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </IconButton>
          )}
          {!isMobile && links.map((link, index) => (
            <Button key={index} color="inherit" sx={{ marginRight: 2 }} onClick={() => navigate(link.path)}>
              {link.label}
            </Button>
          ))}
          {/* Display Menu specific to Regular Users  */}
          {!isMobile && Auth.loggedIn() && !Auth.isAdmin() && (
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
          {/* Display Menu specific to Admin Users  */}
          {!isMobile && Auth.loggedIn() && Auth.isAdmin() && (
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
          {Auth.loggedIn() && (
            <>
              {!isMobile && (
                <Button color="inherit" onClick={handleLogout}>
                  LOGOUT
                </Button>
              )}              
              <Avatar sx={{ marginLeft: 1, height: 50, width: 50 }} />
            </>
          )}
          {!Auth.loggedIn() && !isMobile && (
            <Button color="inherit" onClick={() => setModalOpen(true)}>Login/Signup</Button>
          )}
        </Box>
      </Toolbar>

      <Dialog open={searchOpen} onClose={() => setSearchOpen(false)}>
        <DialogTitle>Search Books</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            color="secondary"
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchOpen(false)}>Cancel</Button>
          <Button onClick={handleSearch} variant="contained" color="secondary">Search</Button>
        </DialogActions>
      </Dialog>

      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
          <List sx={{ width: 250 }}>
            {links.map((link, index) => (
              <ListItem component={Button} key={index} onClick={() => handleNavigate(link.path)}>
                <ListItemText primary={link.label} sx={{ color: isMobile && mode === "dark" ? "#ffffff" : "inherit" }}/>
              </ListItem>
            ))}
            {/* Display Manage Users only for Admin Users  */}
            {Auth.loggedIn() && (
              Auth.isAdmin() ? (
                <ListItem component={Button} onClick={() => handleNavigate("/manageusers")}>
                  <ListItemText primary="Manage Users" sx={{ color: isMobile && mode === "dark" ? "#ffffff" : "inherit" }}/>
                </ListItem>
              ) : (
                <>
                  <ListItem component={Button} onClick={() => handleNavigate("/shelf")}>
                    <ListItemText primary="My Shelf" sx={{ color: isMobile && mode === "dark" ? "#ffffff" : "inherit" }}/>
                  </ListItem>
                  <ListItem component={Button} onClick={() => handleNavigate("/account")}>
                    <ListItemText primary="My Account" sx={{ color: isMobile && mode === "dark" ? "#ffffff" : "inherit" }}/>
                  </ListItem>
                  <ListItem component={Button} onClick={() => handleNavigate("/challenges")}>
                    <ListItemText primary="Challenges" sx={{ color: isMobile && mode === "dark" ? "#ffffff" : "inherit" }}/>
                  </ListItem>
                </>
              )
            )}
            {Auth.loggedIn() && (
              <ListItem component={Button} onClick={handleLogout}>
                <ListItemText primary="Logout" sx={{ color: isMobile && mode === "dark" ? "#ffffff" : "inherit" }}/>
              </ListItem>
            )}
            {!Auth.loggedIn() && (
              <ListItem component={Button} onClick={() => setModalOpen(true)}>
                <ListItemText primary="Login/Signup" sx={{ color: isMobile && mode === "dark" ? "#ffffff" : "inherit" }}/>
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
