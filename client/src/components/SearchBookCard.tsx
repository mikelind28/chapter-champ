import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../graphql/mutations";

import type { Book } from '../interfaces/Book';
import { GET_ME } from "../graphql/queries";

export default function SearchBookCard({ ...CardProps }: Book) {
  const [showDescription, setShowDescription] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [readingStatus, setReadingStatus] = useState<string>("Add to"); // Default text before selecting a reading status
  const [isFavorite, setIsFavorite] = useState(false);

  // Apollo mutation to save the book's reading status or favorite
  const [saveBook] = useMutation(SAVE_BOOK, {
    refetchQueries: [
        GET_ME,
        'me'
    ]
    });

  // Toggle the description visibility when clicking "Description"
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  // Open the reading status menu
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Select a reading status and save it to the database
  const handleMenuClose = async (status: string) => {
    setReadingStatus(status);
    setAnchorEl(null);

    try {
      await saveBook({
        variables: {
          input: {
            bookId: CardProps.bookDetails.bookId,
            title: CardProps.bookDetails.title,
            authors: CardProps.bookDetails.authors,
            description: CardProps.bookDetails.description,
            thumbnail: CardProps.bookDetails.thumbnail,
            pageCount: CardProps.bookDetails.pageCount,
            categories: CardProps.bookDetails.categories,
            infoLink: CardProps.bookDetails.infoLink,
          },
          status: status,
        },
      });
      console.log(`📚 Updated reading status: ${status}`);
    } catch (error) {
      console.error("❌ Error updating reading status:", error);
    }
  };

  // Toggle the favorite status and save it to the database
  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);

    try {
      await saveBook({
        variables: {
          input: {
            bookId: CardProps.bookDetails.bookId,
            title: CardProps.bookDetails.title,
            authors: CardProps.bookDetails.authors,
            description: CardProps.bookDetails.description,
            thumbnail: CardProps.bookDetails.thumbnail,
            pageCount: CardProps.bookDetails.pageCount,
            categories: CardProps.bookDetails.categories,
            infoLink: CardProps.bookDetails.infoLink,
          },
          status: "FAVORITE",
        },
      });
      console.log(`⭐ ${CardProps.bookDetails.title} added to favorites.`);
    } catch (error) {
      console.error("❌ Error saving to favorites:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 300, cursor: "pointer", position: "relative" }} key={CardProps.bookDetails.bookId}>
      <CardActionArea>
        {/* Book Thumbnail */}
        <CardMedia
          component="img"
          height="180"
          width="100"
          image={CardProps.bookDetails.thumbnail || "https://via.placeholder.com/150"}
          alt={CardProps.bookDetails.title}
        />
        <CardContent>
          {/* Book Title */}
          <Typography gutterBottom variant="h6" component="div">
            {CardProps.bookDetails.title}
          </Typography>

          {/* Book Authors */}
          <Typography variant="body2" color="text.secondary">
            {CardProps.bookDetails.authors?.join(", ") || "Unknown Author"}
          </Typography>

          {/* Book Categories */}
          <Typography variant="body2" color="text.primary">
            {CardProps.bookDetails.categories?.join(", ") || "Uncategorized"}
          </Typography>

          {/* Show description only when clicking "Description" */}
          <Button variant="text" onClick={toggleDescription} sx={{ textTransform: "none", color: "primary.main" }}>
            Description
          </Button> 
          {showDescription && (
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              {CardProps.bookDetails.description || "No description available."}
            </Typography>
          )}

          {/* Favorite Button & Reading Status Menu */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            {/* Favorite Button */}
            <IconButton onClick={toggleFavorite} color={isFavorite ? "error" : "default"}>
              <FavoriteIcon />
            </IconButton>

            {/* Reading Status Selector */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body2" sx={{ marginRight: 1, fontStyle: "italic" }}>
                {readingStatus}
              </Typography>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
            </div>

            {/* Reading Status Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={() => handleMenuClose("WANT_TO_READ")}>📖 Want to Read</MenuItem>
              <MenuItem onClick={() => handleMenuClose("CURRENTLY_READING")}>📚 Currently Reading</MenuItem>
              <MenuItem onClick={() => handleMenuClose("FINISHED_READING")}>✅ Finished Reading</MenuItem>
            </Menu>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}