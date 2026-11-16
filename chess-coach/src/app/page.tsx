"use client";

import { useState } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./components/ChessBoard";
import NewGameDialog from "./components/newGame";

export default function Home() {
     const [game] = useState(() => new Chess());
     const [fen, setFen] = useState(() => game.fen());
     const [playerColor, setPlayerColor] = useState<"white" | "black">("white");

  function handleMove(from: string, to: string) {
    if (game.isGameOver()) return false;

    try {
      game.move({ from, to, promotion: "q" });
      setFen(game.fen());
      return true;
    } catch {
       return false;
      }
   }
   function startGame(color: "white" | "black") {
    game.reset();
    setFen(game.fen());
    setPlayerColor(color);

    }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-black">
        <div className="w-full max-w-xl">
          <ChessBoard position={fen} onMove={handleMove} boardOrientation={playerColor} />
          <NewGameDialog onChooseSide={startGame} /> 
      </div>
    </main>
  );
}