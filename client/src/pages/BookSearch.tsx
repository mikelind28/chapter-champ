import React from "react";
import { useLocation } from "react-router-dom";
import { Grid, Box, Typography} from "@mui/material";

import { useQuery } from "@apollo/client";
import { SEARCH_GOOGLE_BOOKS } from "../graphql/queries";
import SearchBookCard from "../components/SearchBookCard";



const BookSearch: React.FC = () => {
  const location = useLocation(); 
  const searchParams = new URLSearchParams(location.search);

  // Obtain query, author, and genre from URL
  const query = searchParams.get("query") || ""; 
 

  // GraphQL query to search Google Books
  const { loading, error, data } = useQuery(SEARCH_GOOGLE_BOOKS, {
    variables: { query },
    skip: !query,
  });

 

  return (
    <Box sx={{ display: "flex" }}>            {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>         
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
