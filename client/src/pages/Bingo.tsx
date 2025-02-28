import { useQuery } from "@apollo/client";
import { BingoCard } from "../components/BingoCard";
// import { BingoCell } from "../components/BingoCell";
import { GET_ME } from "../graphql/queries";
import { useEffect, useState } from "react";
import { Book } from "../interfaces/Book";
import { Button } from "@mui/material";

export default function Bingo() {
    // retrieve current user's information
    const { data } = useQuery(GET_ME);

    // if there are not enough books to fill a bingo card, use this boolean
    const [enoughBooks, setEnoughBooks] = useState<boolean>(false);

    // bookArray will store only "Currently Reading" and "Want to Read" books for the bingo card
    const [bookArray, setBookArray] = useState<Book[]>([]);

    // bingoCard is an array of arrays - three books across three columns
    const [bingoCard, setBingoCard] = useState<(Book)[][]>([]);

    // only display the print feature if a bingo card has rendered
    const [displayPrint, setDisplayPrint] = useState<boolean>(false);

    // populate the bookArray with the correct types of data whenever user data loads
    useEffect(() => {
        if (data) {
            if (data.me.savedBooks.filter((book: Book) => 
                book.status === "CURRENTLY_READING" || 
                book.status === "WANT_TO_READ" ).length >= 9) {
                setEnoughBooks(true);
                setBookArray(data.me.savedBooks.filter((book: Book) => book.status === "CURRENTLY_READING" || book.status === "WANT_TO_READ" ));
            };
        }
    }, [data]);

    // shuffle the bingo card when button is pushed
    const handleShuffle = () => {
        const shuffleBooks = (bookArray: Book[]) => {
            const shuffledBooks = [...bookArray].sort(() => Math.random() - 0.5);

            const grid: (Book)[][] = [];

            for (let i = 0; i < 3; i++) {
                grid.push(shuffledBooks.slice(i * 3, i * 3 + 3));
            }

            setBingoCard([...grid]);
        }
        shuffleBooks([...bookArray]);
        setDisplayPrint(true);
    }

    // allow users to print their bingo card when button is pushed
    const handlePrint = () => {
        window.print();
    }
    
    return (
        <>
            {!enoughBooks && <p style={{textAlign: "center", margin: "20px"}}>Not enough books in your library to fill the bingo card! Add at least 9 books to your "Want to Read" or "Currently Reading" categories to play bingo.</p>}

            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Button variant="contained" color="secondary" style={{margin: 10}} disabled={!enoughBooks} onClick={handleShuffle}>
                    Shuffle Unfinished Books
                </Button>
                {displayPrint &&
                    <Button variant="outlined" color="secondary" style={{margin: 10}} disabled={!enoughBooks} onClick={handlePrint}>
                         Print This Bingo Card
                    </Button>
                }
            </div>

            {bookArray.length >= 9 && <BingoCard bingoCard={bingoCard} />}
            
        </>
    )
}