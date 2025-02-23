
import { Box, Grid } from "@mui/material";
import ActionAreaCard from "../components/MyShelfCards"; // Import the reusable card component
import { GET_ME } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export default function ShelfPage() {

  const { loading, error, data } = useQuery(GET_ME);
  console.log(loading);
  console.log(error);
  console.log(data);

  const [favoriteCount, setFavoriteCount] = useState("");
  const [finishedReadingCount, setFinishedReadingCount] = useState("");
  const [wantToReadCount, setWantToReadCount] = useState("");
  const [currentlyReadingCount, setCurrentlyReadingCount] = useState("");

  useEffect(() => {
    if (data) {
      setFavoriteCount(data.me.favoriteCount);
      setFinishedReadingCount(data.me.finishedReadingCount);
      setWantToReadCount(data.me.wantToReadCount);
      setCurrentlyReadingCount(data.me.currentlyReadingCount);
    }
  }, [data])

  if (loading) {
    console.log("loading:", loading);
  }

  const shelfItems = [
    {
      title: "Want to Read",   
      numBooks: `${wantToReadCount}`, 
      image: "https://fakeimg.pl/600x400", // Replace with actual image URL
    },
    {
      title: "Currently Reading",   
      numBooks: `${currentlyReadingCount}`, 
      image: "https://fakeimg.pl/600x400",
    },
    {
      title: "Finished Reading",    
      numBooks: `${finishedReadingCount}`, 
      image: "https://fakeimg.pl/600x400",
    },
    {
      title: "Favorites",    
      numBooks: `${favoriteCount}`, 
      image: "https://fakeimg.pl/600x400",
    },
    
  ];

  
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
