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
import ManageUsers from './pages/ManageUsers.tsx';
import WantToRead from './pages/WantToRead.tsx';
import CurrentlyReading from './pages/CurrentlyReading.tsx';
import FinishedReading from './pages/FinishedReading.tsx';
import Favorites from './pages/Favorites.tsx';
import BookSearch from './pages/BookSearch.tsx';
import Bingo from './pages/Bingo.tsx';

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
      { path: "book-search", element: <BookSearch /> },
      { path: "challenges", element: <Challenges /> },
      { path: "manageusers", element: <ManageUsers /> },
      { path: "want-to-read", element: <WantToRead />},
      { path: "currently-reading", element: <CurrentlyReading />},
      { path: "finished-reading", element: <FinishedReading />},
      { path: "favorites", element: <Favorites />},
      { path: "bingo", element: <Bingo />},
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