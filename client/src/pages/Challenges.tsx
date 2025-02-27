import { GET_ME } from "../graphql/queries";
import { useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import ActionAreaCard from "../components/MyShelfCards";
import { useEffect, useState } from "react";

export default function Challenges() {
  const { data } = useQuery(GET_ME);
  const [finishedReadingCount, setFinishedReadingCount] = useState<number>(0);
  const [fiveBookChallengeImage, setFiveBookChallengeImage] = useState<string>("https://www.shutterstock.com/shutterstock/videos/697813/thumb/1.jpg?ip=x480");
  const [tenBookChallengeImage, setTenBookChallengeImage] = useState<string>("https://www.shutterstock.com/shutterstock/videos/697813/thumb/1.jpg?ip=x480");
  const [twentyBookChallengeImage, setTwentyBookChallengeImage] = useState<string>("https://www.shutterstock.com/shutterstock/videos/697813/thumb/1.jpg?ip=x480");
  

  useEffect(() => {
    if (data) {
      setFinishedReadingCount(data.me.finishedReadingCount);
    }
  }, [data]);

  useEffect(() => {
    if (finishedReadingCount >= 5) {
      setFiveBookChallengeImage("https://t4.ftcdn.net/jpg/04/93/91/31/360_F_493913135_q0Ar7Aund7lRPFSxa8qg1hTQmhG5kdNP.jpg")
    } else if (finishedReadingCount >= 10) {
      setTenBookChallengeImage("https://t4.ftcdn.net/jpg/04/93/91/31/360_F_493913135_q0Ar7Aund7lRPFSxa8qg1hTQmhG5kdNP.jpg")
    } else if (finishedReadingCount >=20) {
      setTwentyBookChallengeImage("https://t4.ftcdn.net/jpg/04/93/91/31/360_F_493913135_q0Ar7Aund7lRPFSxa8qg1hTQmhG5kdNP.jpg")
    }
  }, [finishedReadingCount])

  const challengeItems = [
      {
          title: "Complete the Bingo Challenge",
          description: "Make 3 in a row to complete the bingo challenge.",
          image: "https://vision-forward.org/wp-content/uploads/2015/10/G48725.jpg",
      },
      {
          title: "Read 5 Books",
          description: "Challenge yourself to read 5 books.",
          image: `${fiveBookChallengeImage}`,
      },
      {
          title: "Read 10 Books",
          description: "Challenge yourself to read 10 books.",
          image: `${tenBookChallengeImage}`,
      },
      {
          title: "Read 20 Books",
          description: "Challenge yourself to read 20 books.",
          image: `${twentyBookChallengeImage}`,
      },
  ];

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