import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Grid, Box, Typography, Drawer, TextField, Button} from "@mui/material";
import { useQuery } from "@apollo/client";
import { SEARCH_GOOGLE_BOOKS } from "../graphql/queries";
import SearchBookCard from "../components/SearchBookCard";

const drawerWidth = 280;

const BookSearch: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // Obtener los valores actuales de la URL
  const query = searchParams.get("query") || "";
  const author = searchParams.get("author") || "";
  const genre = searchParams.get("genre") || "";

  // Estados para los filtros
  const [searchQuery, setSearchQuery] = useState(query);
  const [authorQuery, setAuthorQuery] = useState(author);
  const [genreQuery, setGenreQuery] = useState(genre);

  // GraphQL Query con filtros
  const { loading, error, data } = useQuery(SEARCH_GOOGLE_BOOKS, {
    variables: { query: searchQuery, author: authorQuery, genre: genreQuery },
    skip: !searchQuery,
  });

  // Manejar cambios en los filtros y actualizar la URL
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (authorQuery) params.set("author", authorQuery);
    if (genreQuery) params.set("genre", genreQuery);
    navigate(`/book-search?${params.toString()}`);
  };

  return (
    <Box sx={{ display: "flex" }}>   
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,           
          height: "100vh",        
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", top: 100 }, // top: 100 to avoid overlapping with Navbar
        }}
      >
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6">Search By</Typography>

          {/* Campo de búsqueda por título */}
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Campo de búsqueda por autor */}
          <TextField
            fullWidth
            label="Author"
            variant="outlined"
            margin="normal"
            value={authorQuery}
            onChange={(e) => setAuthorQuery(e.target.value)}
          />

          {/* Campo de búsqueda por género */}
          <TextField
            fullWidth
            label="Genre"
            variant="outlined"
            margin="normal"
            value={genreQuery}
            onChange={(e) => setGenreQuery(e.target.value)}
          />

          {/* Botón para aplicar los filtros */}
          <Button fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleSearch}>
            Apply Filters
          </Button>
        </Box>
      </Drawer> 

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3, marginLeft: "100px" }}>
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
