import type { Book } from '../interfaces/Book';

export const BingoCell: React.FC<{ book: Book | "FREE"; onClick: () => void; marked: boolean }> = ({ book, onClick, marked }) => (
    <button className={`grid-cell ${marked ? "marked" : ""}`} onClick={onClick}>

        {book === "FREE" ? "FREE SPACE" : (
        <>
          <strong>{book.bookDetails.title}</strong>
          <br />
          <small>{book.bookDetails.authors.join(", ")}</small>
        </>
      )}

    </button>
  );
  

