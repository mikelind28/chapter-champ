import { Typography } from '@mui/material';

import type { Book } from '../interfaces/Book';
import { useEffect, useState } from 'react';


export const BingoCell: React.FC<{ book: Book }> = ({ book }) => {
  const [readingStatus, setReadingStatus] = useState<Book['status']>("");

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
    <button className={`grid-cell` } >
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
            >
              {readingStatus}
            </Typography>
          </div>
    </button>
  );
}
  

