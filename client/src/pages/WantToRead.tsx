import { useQuery } from "@apollo/client";
import { GET_ME } from "../graphql/queries";
import { useEffect, useState } from "react";
import type { Book } from "../interfaces/Book";
import SearchBookCard from '../components/SearchBookCard';

// page to display user's "want to read" books
export default function WantToRead() {
    const { loading, error, data } = useQuery(GET_ME);
    console.log(loading);
    console.log(error);
    console.log(data);

    const [bookArray, setBookArray] = useState<Book[]>([]);

    // filter out only books with "want to read" status and put them into bookArray
    useEffect(() => {
        if (data) {
            setBookArray(data.me.savedBooks.filter((book: Book) => book.status === "WANT_TO_READ"));
            console.log("book array:", bookArray);
        }
    }, [data])

    return (
        <>
            <h2 style={{textAlign: "center"}}>Want to Read</h2>
            {bookArray.length === 0 && <p style={{textAlign: "center"}}>No books yet!</p>}
            <div style={{display: "flex", flexWrap: "wrap", margin: 20, justifyContent: "center"}}>
                {bookArray.length > 0 && bookArray.map((eachBook) => (
                    <SearchBookCard {...eachBook} />
                ))}
            </div>
        </>
    );
}
