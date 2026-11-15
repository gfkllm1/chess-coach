"use client";

import { Chessboard } from "react-chessboard";

type ChessBoardProps = {
  position: string;
  onMove: (from: string, to: string) => boolean;
  boardOrientation?: "white" | "black";
}; 

export default function ChessBoard({ position, onMove, boardOrientation }: ChessBoardProps)  {
    return(
      <Chessboard
        options={{
            position,
            boardOrientation,
            allowDragging: true,
            lightSquareStyle: { backgroundColor: "#f3f1ef" },
            darkSquareStyle: { backgroundColor: "#383736" },
            onPieceDrop: ({ sourceSquare, targetSquare }) => {
            if (!sourceSquare || !targetSquare) return false;
                return onMove(sourceSquare, targetSquare);
             },
        }}
      />
    );

}