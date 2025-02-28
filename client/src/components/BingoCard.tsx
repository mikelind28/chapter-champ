// import { useState } from "react";
import { BingoCell } from "./BingoCell";
import type { Book } from '../interfaces/Book';
import { useEffect } from "react";
import { Grid } from "@mui/material";

export const BingoCard: React.FC<{ bingoCard: (Book)[][] }> = ({ bingoCard }) => {

    useEffect(() => {
        console.log('bingo card render', bingoCard);
    }, [bingoCard])

    return (
        <div style={{display: "flex", justifyContent: "center", margin: "20px"}}>
            <Grid container sx={{height: "33vw", maxWidth: "1000px"}}>
                {bingoCard.map((row, rowIndex) => (
                    <Grid item key={rowIndex} xs={4} sx={{height: "100%", width: "100%"}}>
                        {row.map((book, colIndex) => (
                            <BingoCell
                                key={colIndex}
                                book={book}
                            />
                        ))}
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

