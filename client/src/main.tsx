import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline} from '@mui/material';

import './reset.css';
import './index.css';

import App from './App.tsx';
import HomePage from "./pages/HomePage";
import ShelfPage from "./pages/MyShelfPage";
import AccountPage from "./pages/AccountPage";
import Challenges from "./pages/Challenges";
import Error from './pages/Error.tsx'

// Material UI Theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#293b9a",
    },
    secondary: {
      main: "#4caf50",
    },
    background: {
      default: "#ffffff",
      paper: "#eaeaea",
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App serves as the layout wrapper (Navbar + Outlet)
    errorElement: <Error />,
    children: [
      { index: true, element: <HomePage /> }, // Loads HomePage on "/"
      { path: "shelf", element: <ShelfPage /> },
      { path: "account", element: <AccountPage /> },
      { path: "challenges", element: <Challenges /> },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
}