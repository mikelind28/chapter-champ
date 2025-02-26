import { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';


import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete"
import { useMutation, useApolloClient, useQuery } from "@apollo/client";

import { REMOVE_BOOK, SAVE_BOOK, UPDATE_BOOK_STATUS } from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";

import type { Book, SavedBook } from '../interfaces/Book';

export default function SearchBookCard({ ...CardProps }: Book) {
  const client = useApolloClient();
  const [showDescription, setShowDescription] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [readingStatus, setReadingStatus] = useState<string>("Add to"); // Default text before selecting a reading status
  const [isFavorite, setIsFavorite] = useState(false);
  const [mySavedBooks, setMySavedBooks] = useState<SavedBook[]>([]);

  const [updateBookStatus] = useMutation(UPDATE_BOOK_STATUS, {
    refetchQueries: [{ query: GET_ME }],
  });

  // Apollo query to get the user's saved books
  const { data } = useQuery(GET_ME);

  useEffect(() => {
    if (data) {
        setMySavedBooks(data.me.savedBooks);
    }
  }, [data])

  useEffect(() => {
    for (const eachBook of mySavedBooks) {
      if (eachBook.bookDetails.bookId === CardProps.bookDetails.bookId) {
        if (eachBook.status === "FAVORITE") {
          setIsFavorite(true);
        } else {
          switch (eachBook.status) {
            case "WANT_TO_READ":
              setReadingStatus("Want to Read");
              break;
            case "CURRENTLY_READING":
              setReadingStatus("Currently Reading");
              break;
            case "FINISHED_READING":
              setReadingStatus("Finished Reading");
              break;
            default:
              console.log("Error changing book status");
          }
        }
      }
    }
  }, [CardProps, data])

  const isAuthenticated = !!data?.me;  // Check if the user is logged in

  // Apollo mutation to save the book's reading status or favorite
  const [saveBook] = useMutation(SAVE_BOOK, {
    update(cache, { data: { saveBook } }) {
      const existingData = cache.readQuery<any>({ query: GET_ME });

      if (existingData) {
        cache.writeQuery({
          query: GET_ME,
          data: {
            me: {
              ...existingData.me,
              savedBooks: [...existingData.me.savedBooks, saveBook],
            },
          },
        });
      }
    },
  });

  // Toggle the description visibility when clicking "Description"
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  // Select a reading status and save it to the database
  const handleMenuClose = async (status: string) => {
    setAnchorEl(null);
  
    // Verificar si el libro ya está guardado en la biblioteca del usuario
    const existingData = client.readQuery({ query: GET_ME });
    const bookExists = existingData?.me?.savedBooks?.some(
      (book: SavedBook) => book.bookDetails.bookId === CardProps.bookDetails.bookId
    );
  
    try {
      if (!bookExists) {
        console.log("📚 Book not found in library. Saving first...");
  
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
              // averageRating: CardProps.bookDetails.averageRating,
              // ratingsCount: CardProps.bookDetails.averageRating,
              infoLink: CardProps.bookDetails.infoLink,
              status: status,
            },
          },
        });
  
        console.log("✅ Book saved successfully.");
      }

      // Ahora actualizamos el estado de lectura
      await updateBookStatus({
        variables: {
          bookId: CardProps.bookDetails.bookId,
          status: status.toUpperCase().replace(/\s+/g, "_"), // Convertir a ENUM válido
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
            averageRating: CardProps.bookDetails.averageRating,
            ratingsCount: CardProps.bookDetails.averageRating,
            infoLink: CardProps.bookDetails.infoLink,
            status: "FAVORITE",
          },
        },
      });
      console.log(`⭐ ${CardProps.bookDetails.title} added to favorites.`);
    } catch (error) {
      console.error("❌ Error saving to favorites:", error);
    }
  };

  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [{ query: GET_ME }],
  });

  const handleRemoveBook = async () => {
    const bookId = CardProps.bookDetails.bookId;
    try {
      await removeBook({
        variables: { bookId },
        });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card
      sx={{ maxWidth: 300, cursor: "pointer", position: "relative" }}
      key={CardProps.bookDetails.bookId} 
    >
      <CardActionArea component="div">
        {/* Book Thumbnail */}
        <CardMedia
          component="img"
          height="180"
          width="100"
          image={
            CardProps.bookDetails.thumbnail || "https://via.placeholder.com/150"
          }
          alt={CardProps.bookDetails.title}
        />
        <CardContent>
          {/* Book Title */}
          <Typography gutterBottom variant="h6" component="a" href={CardProps.bookDetails.infoLink}>
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
          <Button
            variant="text"
            onClick={toggleDescription}
            sx={{ textTransform: "none", color: "primary.main" }}
          >
            Description
          </Button>
          {showDescription && (
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              {CardProps.bookDetails.description || "No description available."}
            </Typography>
          )}
          {isAuthenticated && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
              <IconButton onClick={toggleFavorite} color={isFavorite ? "error" : "default"}>
                <FavoriteIcon />
              </IconButton>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ marginRight: 1, fontStyle: "italic" }}>
                  {readingStatus}
                </Typography>
                <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                  <MoreVertIcon />
                </IconButton>
              </div>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => handleMenuClose("WANT_TO_READ")}>📖 Want to Read</MenuItem>
                <MenuItem onClick={() => handleMenuClose("CURRENTLY_READING")}>📚 Currently Reading</MenuItem>
                <MenuItem onClick={() => handleMenuClose("FINISHED_READING")}>✅ Finished Reading</MenuItem>
              </Menu>

              {(window.location.pathname === '/favorites' || 
              window.location.pathname === '/currently-reading' || 
              window.location.pathname === '/want-to-read' || 
              window.location.pathname === '/finished-reading') &&
              <IconButton aria-label="delete" onClick={handleRemoveBook}>
                <DeleteIcon />
              </IconButton>
              }
            </div>
          )}

        </CardContent>
      </CardActionArea>
    </Card>
  );
}
