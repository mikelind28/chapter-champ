
import { Box, Grid } from "@mui/material";
import ActionAreaCard from "../components/MyShelfCards"; // Import the reusable card component
import { GET_ME } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Book } from "../interfaces/Book";

export default function ShelfPage() {

  const { loading, error, data } = useQuery(GET_ME);
  console.log(loading);
  console.log(error);
  console.log(data);

  const [favoriteCount, setFavoriteCount] = useState("");
  const [finishedReadingCount, setFinishedReadingCount] = useState("");
  const [wantToReadCount, setWantToReadCount] = useState("");
  const [currentlyReadingCount, setCurrentlyReadingCount] = useState("");

  const [wantToReadImage, setWantToReadImage] = useState("");
  const [currentlyReadingImage, setCurrentlyReadingImage] = useState("");
  const [finishedReadingImage, setFinishedReadingImage] = useState("");
  const [favoriteImage, setFavoriteImage] = useState("");

  useEffect(() => {
    if (data) {
      setFavoriteCount(data.me.favoriteCount);
      setFinishedReadingCount(data.me.finishedReadingCount);
      setWantToReadCount(data.me.wantToReadCount);
      setCurrentlyReadingCount(data.me.currentlyReadingCount);
      setWantToReadImage(
        data.me.savedBooks.filter((book: Book) => book.status === "WANT_TO_READ").length ?
          data.me.savedBooks.filter((book: Book) => book.status === "WANT_TO_READ")[0].bookDetails.thumbnail
        : "https://placehold.co/600x400");
      setCurrentlyReadingImage(
        data.me.savedBooks.filter((book: Book) => book.status === "CURRENTLY_READING").length ?
          data.me.savedBooks.filter((book: Book) => book.status === "CURRENTLY_READING")[0].bookDetails.thumbnail
        : "https://placehold.co/600x400");
      setFinishedReadingImage(
        data.me.savedBooks.filter((book: Book) => book.status === "FINISHED_READING").length ?
          data.me.savedBooks.filter((book: Book) => book.status === "FINISHED_READING")[0].bookDetails.thumbnail
        : "https://placehold.co/600x400");
      setFavoriteImage(
        data.me.savedBooks.filter((book: Book) => book.status === "FAVORITE").length ?
          data.me.savedBooks.filter((book: Book) => book.status === "FAVORITE")[0].bookDetails.thumbnail
        : "https://placehold.co/600x400");
    }
  }, [data])

  if (loading) {
    console.log("loading:", loading);
  }

  const shelfItems = [
    {
      title: "Want to Read",   
      numBooks: `${wantToReadCount}`, 
      image: `${wantToReadImage}`, // Replace with actual image URL
    },
    {
      title: "Currently Reading",   
      numBooks: `${currentlyReadingCount}`, 
      image: `${currentlyReadingImage}`,
    },
    {
      title: "Finished Reading",    
      numBooks: `${finishedReadingCount}`, 
      image: `${finishedReadingImage}`,
    },
    {
      title: "Favorites",    
      numBooks: `${favoriteCount}`, 
      image: `${favoriteImage}`,
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
