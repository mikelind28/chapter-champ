import { Grid, Typography } from '@mui/material';

import type { Book } from '../interfaces/Book';
import { useEffect, useState } from 'react';

// each BingoCell component receives a book prop from BingoCard.tsx component
export const BingoCell: React.FC<{ book: Book }> = ({ book }) => {
  const [readingStatus, setReadingStatus] = useState<Book['status']>("");

  // fix formatting coming from database
  useEffect(() => {
    switch (book.status) {
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
  }, [book]);

  return (
    <Grid item xs={15} sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "1px solid black", borderRadius: 3, height: "100%"}} fontSize={{ xs: 8, sm: 12, md: 12 }}>
          <img 
            src={book.bookDetails.thumbnail} 
            style={{height: "50%", width: "50%", objectFit: "scale-down"}}
          />

          <strong>{book.bookDetails.title}</strong>
          <br />
          <small>{book.bookDetails.authors.join(", ")}</small>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography 
              variant="body2" 
              sx={{ marginRight: 1, fontStyle: "italic" }}
              fontSize={{ xs: 8, sm: 12, md: 12 }}
            >
              {readingStatus}
            </Typography>
          </div>
    </Grid>
  );
}
  

