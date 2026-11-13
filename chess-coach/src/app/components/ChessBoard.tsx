"use client";

import { Chessboard } from "react-chessboard";

export default function ChessBoard() {
    return(
      <Chessboard
        options={{
            allowDragging: true,
            boardOrientation: "white",
            lightSquareStyle: { backgroundColor: "#f0d9b5" },
            darkSquareStyle: { backgroundColor: "#b58863" },
        }}
      />
    );

}