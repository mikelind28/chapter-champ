import { useQuery } from "@apollo/client";
import { BingoCard } from "../components/BingoCard";
// import { BingoCell } from "../components/BingoCell";
import { GET_ME } from "../graphql/queries";
import { useEffect, useState } from "react";
import { Book } from "../interfaces/Book";

export default function Bingo() {
    const { data } = useQuery(GET_ME);

    const [enoughBooks, setEnoughBooks] = useState<boolean>(false);
    const [bookArray, setBookArray] = useState<Book[]>([]);
    const [bingoCard, setBingoCard] = useState<(Book)[][]>([]);
    const [displayPrint, setDisplayPrint] = useState<boolean>(false);

    useEffect(() => {
        if (data) {
            console.log(data);
            if (data.me.savedBooks.filter((book: Book) => 
                book.status === "CURRENTLY_READING" || 
                book.status === "WANT_TO_READ" ).length >= 9) {
                setEnoughBooks(true);
            };
            console.log("book array:", bookArray);
        }
    }, [data]);

    const handleShuffle = () => {
        if (data) {

            setBookArray(data.me.savedBooks.filter((book: Book) => book.status === "CURRENTLY_READING" || book.status === "WANT_TO_READ" ));

            console.log('book array:', bookArray);

            const shuffleBooks = (bookArray: Book[]) => {
                const shuffledBooks = [...bookArray].sort(() => Math.random() - 0.5);

                const grid: (Book)[][] = [];
            
                for (let i = 0; i < 3; i++) {
                    grid.push(shuffledBooks.slice(i * 3, i * 3 + 3));
                }
            
                setBingoCard([...grid]);

                console.log('shuffled books:', shuffledBooks);
                console.log('grid', grid);
            }

            shuffleBooks([...bookArray]);
            setDisplayPrint(true);
        }
    }

    const handlePrint = () => {
        window.print();
    }
    
    return (
        <>
            {!enoughBooks && <p>Not enough books in your library to fill the bingo card! Add at least 9 books to your "Want to Read" or "Currently Reading" categories to play bingo.</p>}

            {enoughBooks && 
            <div>
                <button onClick={handleShuffle}>
                    Shuffle Unfinished Books
                </button>
                {displayPrint &&
                    <button onClick={handlePrint}>
                         Print This Bingo Card
                    </button>
                }
            </div>
            }

            {bookArray.length >= 9 && <BingoCard bingoCard={bingoCard} />}
            
        </>
    )
}