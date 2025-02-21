import React from "react";
import { Box, Grid } from "@mui/material";
import ActionAreaCard from "../components/cards"; // Import the reusable card component

const shelfItems = [
  {
    title: "Want to Read",   
    numBooks: 5, // Replace with actual number of books
    image: "https://fakeimg.pl/600x400", // Replace with actual image URL
  },
  {
    title: "Currently Reading",   
    numBooks: 3, // Replace with actual number of books
    image: "https://fakeimg.pl/600x400",
  },
  {
    title: "Finished Reading",    
    numBooks: 7, // Replace with actual number of books
    image: "https://fakeimg.pl/600x400",
  },
  {
    title: "Favorites",    
    numBooks: 10, // Replace with actual number of books
    image: "https://fakeimg.pl/600x400",
  },
  
];

export default function ShelfPage() {
  return (
    <Box sx={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      <h1>My Shelf</h1>
      <Grid container spacing={3} justifyContent="center">
        {shelfItems.map((item, index) => (
          <Grid item key={index}>
            <ActionAreaCard             
              title={item.title} 
              numbooks={item.numBooks}              
              image={item.image} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
