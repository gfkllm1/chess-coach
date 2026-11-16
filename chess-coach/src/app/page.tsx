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
     const [engineMove, setEngineMove] = useState<string | null>(null);
     const [recommendedMove, setRecommendedMove] = useState<string | null>(null);
     const jobRef = useRef<"play" | "recommend" | null>(null);
     const isPlayerTurn = () => {
      return (game.turn() === (playerColor === "white" ? "w" : "b"));
     }

  function requestEngineMove(job: "play" | "recommend") {
    const engine = engineRef.current;
    if (!engine || !engineReady || jobRef.current || game.isGameOver()) return;

    jobRef.current = job;
    setIsEngineThinking(true);
    setRecommendedMove(null);
    engine.postMessage(`position fen ${game.fen()}`);
    engine.postMessage("go movetime 500");
  }

  function handleMove(from: string, to: string) {
    const playerSide = playerColor === "white" ? "w" : "b";
    if (game.isGameOver() || !engineReady || jobRef.current || game.turn() !== playerSide ) return false;

    try {
      game.move({ from, to, promotion: "q" });
        } catch {
       return false;
      }
      setFen(game.fen());
      setEngineMove(null);
      setRecommendedMove(null);
      requestEngineMove("play");
      return true;
   }

   function startGame(color: "white" | "black") {
    if (!engineReady || jobRef.current) return;

    game.reset();
    setFen(game.fen());
    setPlayerColor(color);
    setEngineMove(null);
    setRecommendedMove(null);
    if (color === "black"){
      requestEngineMove("play");
    }

    }
    useEffect(() => {
      const engine = new Worker("/engine/stockfish-19-lite-single.js");
      engineRef.current = engine;

      
      engine.onmessage = (event) => {

      if (typeof event.data !== "string") return;

      const message = event.data.trim();

      if (message.startsWith("uciok")) {
        engine.postMessage("isready");
      }
      else if (message.startsWith("readyok")) {
        setEngineReady(true);
      }
      else if (message.startsWith("bestmove")) {
        const move = message.split(/\s+/)[1];
        const job = jobRef.current;

        jobRef.current = null;
        setIsEngineThinking(false);

        if (!move || move === "(none)" || move === "0000") return;
        if (job === "recommend"){
          setRecommendedMove(move);
          return;
        }
        if (job === "play") {
          try {
          game.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: move[4] });
          setFen(game.fen());
          setEngineMove(move);
        } catch {
          console.error("Invalid move from engine:", move);
        }
      }
    }
  };
   engine.onerror = (error) => {
        setEngineReady(false);
        setIsEngineThinking(false);
        jobRef.current = null;
        console.error("Engine error:", error);
   };
  
     engine.postMessage("uci");
     return () => {
      engine.terminate();
      engineRef.current = null;
      jobRef.current = null;
    }
    }, [game]);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-black">
        <p className="mb-2 text-center h-6">
          {isEngineThinking
            ? "Engine is thinking..."
            : engineMove
            ? `Engine played: ${engineMove}`
            : ""}
        </p>
        <div className="w-full max-w-xl">
          <ChessBoard position={fen} onMove={handleMove} boardOrientation={playerColor} />
          <NewGameDialog onChooseSide={startGame} /> 
         
      </div>
    </main>
  );
}