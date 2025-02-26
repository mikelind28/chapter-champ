import { useQuery } from "@apollo/client";
import { GET_ME } from "../graphql/queries";
import { useEffect, useState } from "react";
import type { Book } from "../interfaces/Book";
import SearchBookCard from '../components/SearchBookCard';

export default function WantToRead() {
    const { loading, error, data } = useQuery(GET_ME);
    console.log(loading);
    console.log(error);
    console.log(data);

    const [bookArray, setBookArray] = useState<Book[]>([]);

    useEffect(() => {
        if (data) {
            setBookArray(data.me.savedBooks.filter((book: Book) => book.status === "WANT_TO_READ"));
            console.log("book array:", bookArray);
        }
    }, [data])

    return (
        <>
            <h2 style={{textAlign: "center"}}>Want to read:</h2>
            {bookArray.length > 0 && bookArray.map((eachBook) => {
                return (
                     <SearchBookCard {...eachBook} />
                )
            })}
        </>
    );
}
