import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ActionAreaCard from "../components/MyShelfCards";

const SlickSlider = Slider as any; 

interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
}

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch("https://www.googleapis.com/books/v1/volumes?q=best+books&maxResults=6")
      .then((response) => response.json())
      .then((data) => {
        const books = data.items.map((book: any) => ({
          id: book.id,
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors || ["Unknown Author"],
          thumbnail:
            book.volumeInfo.imageLinks?.thumbnail ||
            "/src/assets/images/no-image.png",
        }));
        setFeaturedBooks(books);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  // React-Slick Carousel Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 960,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <Box sx={{ textAlign: "center", padding: "20px" }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Chapter Champ!
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Your Epic Journey into the World of Books.
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "20px", maxWidth: 700, marginX: "auto" }}>
        At Chapter Camp, we transform the way you experience books by gamifying your reading habits. Say goodbye to unfinished books and hello to an engaging, interactive adventure where every chapter read brings you closer to new achievements!
      </Typography>

      <Typography variant="h4" sx={{ marginTop: "40px" }}>
        Featured Books
      </Typography>

      <Box sx={{ maxWidth: 800, margin: "auto", padding: "20px" }}>
        <SlickSlider {...(sliderSettings as any)}>
          {featuredBooks.map((book) => (
            <ActionAreaCard
              key={book.id}
              title={book.title}
              numbooks={book.authors.join(", ")}
              image={book.thumbnail}
            />
          ))}
        </SlickSlider>
      </Box>
    </Box>
  );
}