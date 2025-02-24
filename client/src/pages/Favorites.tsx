import { useQuery } from "@apollo/client";
import { GET_ME } from "../graphql/queries";
import { useEffect, useState } from "react";
import type { Book } from "../interfaces/Book";
import BookCard from '../components/BookCard';

export default function Favorites() {
    const { loading, error, data } = useQuery(GET_ME);
    console.log(loading);
    console.log(error);
    console.log(data);

    const [bookArray, setBookArray] = useState<Book[]>([]);

    useEffect(() => {
        if (data) {
            setBookArray(data.me.savedBooks.filter((book: Book) => book.status === "FAVORITE"));
            console.log("book array:", bookArray);
        }
    }, [data])

    return (
        <>
            <h2 style={{textAlign: "center"}}>My Favorite Books:</h2>
            {bookArray.length && bookArray.map((eachBook) => {
                return (
                    <BookCard {...eachBook} />
                )
            })}
        </>
    );
}
