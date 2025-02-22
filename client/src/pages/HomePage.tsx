import { Box, Typography, Grid } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import ActionAreaCard from "../components/cards";
import auth from "../utils/auth";


const featuredBooks = [
  {
    title: "The Great Gatsby",
    description: "A classic novel by F. Scott Fitzgerald.",
    image: "https://fakeimg.pl/150x200",
  },
  {
    title: "1984",
    description: "Dystopian novel by George Orwell.",
    image: "https://fakeimg.pl/150x200",
  },
  {
    title: "To Kill a Mockingbird",
    description: "A novel by Harper Lee.",
    image: "https://fakeimg.pl/150x200",
  },
];

export default function HomePage() {

  return (
    <Box  sx={{ textAlign: "center", padding: "20px"}}>
      {/* Sección de bienvenida */}
        <Typography variant="h3" gutterBottom>
        Welcome to Chapter Champ!
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Your Epic Journey into the World of Books.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", margin: "auto", maxWidth: "800px", padding: "20px"}}>
        <Typography variant="body1" sx={{ marginBottom: "20px", width: 700 }}>
        At Chapter Camp, we transform the way you experience books by gamifying your reading habits. Say goodbye to unfinished books and hello to an engaging, interactive adventure where every chapter read brings you closer to new achievements!
        </Typography>     
        </Box>

      {/* Sección de libros destacados */}
        <Typography variant="h4" sx={{ marginTop: "40px" }}>
        Featured Books
        </Typography>
        <Grid container spacing={3} justifyContent="center" sx={{ marginTop: "20px" }}>
          {featuredBooks.map((book, index) => (
            <Grid item key={index}>
              <ActionAreaCard                           
                image={book.image} 
              />
            </Grid>
          ))}
        </Grid>
    </Box>
  );
}
