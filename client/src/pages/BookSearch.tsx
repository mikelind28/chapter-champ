import React from "react";
import { useLocation } from "react-router-dom";
import { Grid, Box, Typography, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useQuery } from "@apollo/client";
import { SEARCH_GOOGLE_BOOKS } from "../graphql/queries";
import BookCard from "../components/BookCard";

const BookSearch: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query") || "";
  const searchQuery = query.trim();

  console.log("Query send to GraphQL:", searchQuery);

  const { loading, error, data } = useQuery(SEARCH_GOOGLE_BOOKS, {
    variables: { query: searchQuery },
    skip: !searchQuery, 
  });

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
        <Box sx={{ width: 240, padding: 2 }}>
          <Typography variant="h6">Advanced Search</Typography>
          <List>
            <ListItem button>
              <ListItemText primary="By Genre" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="By Author" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="By Year" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3, marginLeft: "240px" }}>
        <Typography variant="h4">Search Results for "{query}"</Typography>

        {loading && <Typography>Loading...</Typography>}
        {error && <Typography>Error: {error.message}</Typography>}

        <Grid container spacing={3} sx={{ marginTop: 2 }}>
        {data?.searchGoogleBooks?.map((book: any) => (
            <Grid item key={book.bookId} xs={12} sm={6} md={4} lg={3}>
              <BookCard bookDetails={book} status={book.status} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default BookSearch;
