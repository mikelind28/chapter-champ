

import { Grid } from "@mui/material";
import ActionAreaCard from "../components/cards";

const challengeItems = [
    {
        title: "Complete the Bingo Challenge",
        description: "Make 3 in a row to complete the bingo challenge.",
        image: "https://fakeimg.pl/600x400",
    },
    {
        title: "Read 5 Books in 2025",
        description: "Challenge yourself to read 5 books in 2022.",
        image: "https://fakeimg.pl/600x400",
    },
    {
        title: "Read 10 Books in 2025",
        description: "Challenge yourself to read 10 books in 2022.",
        image: "https://fakeimg.pl/600x400",
    },
    {
        title: "Read 20 Books in 2025",
        description: "Challenge yourself to read 20 books in 2022.",
        image: "https://fakeimg.pl/600x400",
    },
    ];

export default function Challenges() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Challenges</h1>
      <Grid container spacing={3} justifyContent="center" sx={{ marginTop: "20px" }}>
          {challengeItems.map((challenge, index) => (
            <Grid item key={index}>
              <ActionAreaCard             
                title={challenge.title} 
                description={challenge.description}              
                image={challenge.image} 
              />
            </Grid>
          ))}
        </Grid>
    </div>
  );
}