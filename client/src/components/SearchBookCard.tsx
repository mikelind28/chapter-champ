import { useState, useEffect } from "react";
import {
  Card,
  Box,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Button,
  Modal,
} from "@mui/material";
import { useMutation, useApolloClient, useQuery } from "@apollo/client";
import {
  REMOVE_BOOK,
  SAVE_BOOK,
  UPDATE_BOOK_STATUS,
} from "../graphql/mutations";
import { GET_ME } from "../graphql/queries";
import type { Book, SavedBook } from "../interfaces/Book";

// Modal style
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function SearchBookCard({ ...CardProps }: Book) {
  const client = useApolloClient();
  const [showDescription, setShowDescription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mySavedBooks, setMySavedBooks] = useState<SavedBook[]>([]);
  const [readingStatus, setReadingStatus] = useState<string>("Add to");

  const MAX_DESCRIPTION_LENGTH = 120;

  const { data } = useQuery(GET_ME);

  const [updateBookStatus] = useMutation(UPDATE_BOOK_STATUS, {
    refetchQueries: [{ query: GET_ME }],
  });

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

  const [removeBook] = useMutation(REMOVE_BOOK, {
    refetchQueries: [{ query: GET_ME }],
  });

  useEffect(() => {
    if (data) setMySavedBooks(data.me.savedBooks);
  }, [data]);

  useEffect(() => {
    for (const eachBook of mySavedBooks) {
      if (eachBook.bookDetails.bookId === CardProps.bookDetails.bookId) {
        if (eachBook.status === "FAVORITE") setIsFavorite(true);
        else {
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
  }, [CardProps, data]);

  const getTruncatedDescription = (description: string) => {
    if (!description) return "No description available.";
    return description.length <= MAX_DESCRIPTION_LENGTH
      ? description
      : `${description.substring(0, MAX_DESCRIPTION_LENGTH)}... `;
  };

  return (
    <>
      <Card
        sx={{
          width: 280,
          height: 520,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          cursor: "pointer",
          position: "relative",
          boxShadow: 3,
        }}
        key={CardProps.bookDetails.bookId}
      >
        <CardActionArea component="div" sx={{ height: "100%" }}>
          {/* Book Thumbnail */}
          <CardMedia
            component="img"
            sx={{
              height: 220,
              width: "100%",
              objectFit: "contain",
              backgroundColor: "#f5f5f5",
              padding: "10px",
            }}
            image={
              CardProps.bookDetails.thumbnail ||
              "/src/assets/images/no-image.png"
            }
            alt={CardProps.bookDetails.title}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/src/assets/images/no-image.png";
            }}
          />

          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Book Title */}
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                fontWeight: 600,
              }}
            >
              {CardProps.bookDetails.title}
            </Typography>

            {/* Book Authors */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.875rem" }}
            >
              {CardProps.bookDetails.authors?.[0] || "Unknown Author"}
            </Typography>

            {/* Book Categories */}
            <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
              {CardProps.bookDetails.categories?.join(", ") || "Uncategorized"}
            </Typography>

            {/* Description with "Read More" */}
            <Typography variant="body2" sx={{ mt: 1 }}>
              {getTruncatedDescription(CardProps.bookDetails.description)}
              {CardProps.bookDetails.description &&
                CardProps.bookDetails.description.length >
                  MAX_DESCRIPTION_LENGTH && (
                  <Button
                    variant="text"
                    size="small"
                    sx={{ textTransform: "none", padding: 0 }}
                    onClick={() => setShowModal(true)}
                  >
                    Read More
                  </Button>
                )}
            </Typography>

            {/* Buttons Side by Side */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                flexWrap: "wrap",
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                size="small"
                href={CardProps.bookDetails.infoLink.replace(
                  "http://",
                  "https://"
                )}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textTransform: "none", flex: "1 1 45%" }}
              >
                View on Google Books
              </Button>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      {/* Modal for Full Description */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            {CardProps.bookDetails.title}
          </Typography>
          <Typography variant="body2">
            {CardProps.bookDetails.description || "No description available."}
          </Typography>
          <Button
            onClick={() => setShowModal(false)}
            variant="contained"
            sx={{ mt: 2 }}
            fullWidth
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}
