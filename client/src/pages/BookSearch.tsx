import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Box, Typography, Drawer, TextField, Button} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useQuery } from "@apollo/client";
import { SEARCH_GOOGLE_BOOKS } from "../graphql/queries";
import SearchBookCard from "../components/SearchBookCard";

const drawerWidth = 280;

const BookSearch: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // State to handle Drawer visibility on mobile
  const [openDrawer, setOpenDrawer] = useState(false);

  // Obtain query, author, and genre from URL
  const query = searchParams.get("query") || "";
  const author = searchParams.get("author") || "";
  const genre = searchParams.get("genre") || "";

  // State to store search query, author, and genre
  const [searchQuery, setSearchQuery] = useState(query);
  const [authorQuery, setAuthorQuery] = useState(author);
  const [genreQuery, setGenreQuery] = useState(genre);

  // GraphQL query to search Google Books
  const { loading, error, data } = useQuery(SEARCH_GOOGLE_BOOKS, {
    variables: { query: searchQuery, author: authorQuery, genre: genreQuery },
    skip: !searchQuery,
  });

  // Manages the search functionality
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (authorQuery) params.set("author", authorQuery);
    if (genreQuery) params.set("genre", genreQuery);
    navigate(`/book-search?${params.toString()}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Button to open the Drawer */}

      {/* Sidebar (Drawer) */}
      <Drawer
        variant="temporary" // Now always acts as a modal
        open={openDrawer} // Controlled by state
        onClose={() => setOpenDrawer(false)} // Close function
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6">Search By</Typography>

          {/* Search Form */}
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <TextField
            fullWidth
            label="Author"
            variant="outlined"
            margin="normal"
            value={authorQuery}
            onChange={(e) => setAuthorQuery(e.target.value)}
          />

          <TextField
            fullWidth
            label="Genre"
            variant="outlined"
            margin="normal"
            value={genreQuery}
            onChange={(e) => setGenreQuery(e.target.value)}
          />

          <Button fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleSearch}>
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
          <Button
            variant="contained"
            startIcon={<MenuIcon />}
            sx={{ margin: 2 }}
            onClick={() => setOpenDrawer(true)}
          >
            Open Search Filters
          </Button>
        <Typography variant="h4">Search Results for "{query}"</Typography>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography>Error: {error.message}</Typography>}

        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          {data?.searchGoogleBooks?.map((book: any) => (
            <Grid item key={book.bookId} xs={12} sm={6} md={4} lg={3}>
              <SearchBookCard bookDetails={book} status={book.status} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default BookSearch;
