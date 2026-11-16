"use client";

import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./components/ChessBoard";
import NewGameDialog from "./components/newGame";

export default function Home() {
     const [game] = useState(() => new Chess());
     const [fen, setFen] = useState(() => game.fen());
     const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
     const engineRef = useRef<Worker | null>(null);
     const [isEngineThinking, setIsEngineThinking] = useState(false);
     const [engineReady, setEngineReady]= useState(false);

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
    function requestEngineMove() {
      const engine = engineRef.current;
      if (!engineReady || !engine || game.isGameOver()) return;
      
      setIsEngineThinking(true);
      engine.postMessage("position fen " + game.fen());
      engine.postMessage("go depth 15");
      
    }


    useEffect(() => {

    const engine = new Worker("./engine/stockfish.js");
    engineRef.current = engine;

    engine.onmessage = (event) => {
      const message = event.data;
      if (message.startsWith("uciok")) {
        engine.postMessage("Engine is ready.");
      }
      else if (message.startsWith("readyok")) {
        setEngineReady(true);
      }
      else if (message.startsWith("bestmove")) {
        console.log("Engine recommended move:", message);
        setIsEngineThinking(false);
      }

    };
     engine.postMessage("uci");
     return () => {
      engine.terminate();
      engineRef.current = null;
    }
    }, []);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-black">
        <div className="w-full max-w-xl">
          <ChessBoard position={fen} onMove={handleMove} boardOrientation={playerColor} />
          <NewGameDialog onChooseSide={startGame} /> 
         
      </div>
    </main>
  );
}