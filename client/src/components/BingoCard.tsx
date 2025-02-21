import { useEffect, useState } from "react";
import { BingoCell } from "./BingoCell";
import type { Book } from '../interfaces/Book';

const generateBingoCard = (books: Book[]) => {
    if (books.length < 9) {
        throw new Error("Not enough books to fill the Bingo card.");
    }
    
    const shuffledBooks = [...books].sort(() => Math.random() - 0.5);
    const grid: (Book | "FREE")[][] = [];
    
    for (let i = 0; i < 3; i++) {
        grid.push(shuffledBooks.slice(i * 3, i * 3 + 3));
    }
    
    grid[1][1] = "FREE"; // Center cell is always a free space
    
    return grid;
};

export const BingoCard: React.FC<{ bookArray: Book[] }> = ({ bookArray }) => {

    const [card, setCard] = useState<(Book | "FREE")[][]>(() => generateBingoCard(bookArray));
    
    const [marked, setMarked] = useState<boolean[][]>(Array(3).fill(null).map(() => Array(3).fill(false)));

    const [win, setWin] = useState(false);

    const checkWin = (marked: boolean[][]) => {
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
          if (marked[i].every(Boolean) || marked.map(row => row[i]).every(Boolean)) {
            setWin(true);
          }
        }
      
        // Check diagonals
        if ([0, 1, 2].every(i => marked[i][i]) || [0, 1, 2].every(i => marked[i][2 - i])) {
          setWin(true);
        }
      
        setWin(false);
    };

    useEffect(() => {
        checkWin
    }), [marked];
      

    const handleCellClick = (row: number, col: number) => {
      setMarked(prev => {
        const newMarked = prev.map(row => [...row]);
        newMarked[row][col] = !newMarked[row][col];
        return newMarked;
      });
    };

    return (
        <>
            {win && <p>BINGO!</p>}
            <div className="grid-container">
                {card.map((row, rowIndex) => (
                    <div key={rowIndex} className="bingo-row">
                        {row.map((book, colIndex) => (
                            <BingoCell
                                key={colIndex}
                                book={book}
                                marked={marked[rowIndex][colIndex]}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

