"use client";

import { Chessboard } from "react-chessboard";

type ChessBoardProps = {
  position: string;
  onMove: (from: string, to: string) => boolean;
  boardOrientation?: "white" | "black";
  recommendedMove : string | null;
}; 

export default function ChessBoard({ position, onMove, boardOrientation ,recommendedMove}: ChessBoardProps)  {
    return(
      <Chessboard
        options={{
            position,
            boardOrientation,
            allowDragging: true,
            lightSquareStyle: { backgroundColor: "#f3f1ef" },
            darkSquareStyle: { backgroundColor: "#383736" },
            squareStyles: recommendedMove ? {[recommendedMove.slice(0, 2)]: { backgroundColor: "#e40f0f" },[recommendedMove.slice(2, 4)]: { backgroundColor: "#e40f0f" },}: {},
            onPieceDrop: ({ sourceSquare, targetSquare }) => {
            if (!sourceSquare || !targetSquare) return false;
                return onMove(sourceSquare, targetSquare);
             },
        }}
      />
    );

}