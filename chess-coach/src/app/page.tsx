"use client";

import { useEffect, useState, useRef } from "react";
import { Chess , type Square} from "chess.js";
import ChessBoard from "./components/ChessBoard";
import NewGameDialog from "./components/newGame";
import  MoveChat  from "./components/MoveChat";
import { useAuthUser } from "../lib/userAuth";
import {
  useGameAutoSave,
  type SavedMessage,
} from "../lib/autoSave";

export default function Home() {
  const { userId, error } = useAuthUser();

  if (userId === undefined) {
    return (
      <p className="p-6 text-center" role="status">
        Loading…
      </p>
    );
  }

  return (
    <>
      {error && (
        <p className="p-3 text-center text-red-700" role="alert">
          {error}
        </p>
      )}

      <ChessGame
        key={userId ?? "guest"}
        userId={userId}
      />
    </>
  );
}

function ChessGame({ userId }: { userId: string | null }) {

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
     const [highlightMoves, setHighlightMoves] = useState(true);
     const [chatOpen, setChatOpen] = useState(false);
const [round, setRound] = useState(0);
const [messages, setMessages] = useState<SavedMessage[]>([]);

const savedResult = game.isCheckmate()
  ? game.turn() === "w"
    ? "0-1"
    : "1-0"
  : game.isDraw()
    ? "1/2-1/2"
    : "*";

const { saveStatus, saveError } = useGameAutoSave({
  userId,
  round,
  playerColor,
  fen,
  pgn: game.pgn(),
  result: savedResult,
  messages,
});

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


   function startGame(
  color: "white" | "black",
  highlight: boolean
) {
  if (!engineReady || jobRef.current) return;

  game.reset();

  setRound((current) => current + 1);
  setMessages([]);
  setFen(game.fen());
  setPlayerColor(color);
  setEngineMove(null);
  setRecommendedMove(null);
  setHighlightMoves(highlight);

  if (color === "black") {
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

let resultTitle = "";
let resultReason = "";

if (game.isCheckmate()) {
  const playerSide = playerColor === "white" ? "w" : "b";
  const playerLost = game.turn() === playerSide;

  resultTitle = playerLost
    ? playerColor === "white" ? "Black wins" : "White wins"
    : "You won!";

  resultReason = "By checkmate";
} else if (game.isDraw()) {
  resultTitle = "Draw";
  resultReason = game.isStalemate() ? "By stalemate" : "Game drawn";
}
const resultDialogRef = useRef<HTMLDialogElement>(null);

useEffect(() => {
  const dialog = resultDialogRef.current;
  if (!dialog) return;

  if (resultTitle && !dialog.open) {
    dialog.showModal();
  } else if (!resultTitle && dialog.open) {
    dialog.close();
  }
}, [resultTitle]);

return (
  <main className="flex min-h-screen flex-col bg-white text-black">
 
     <dialog
         ref={resultDialogRef}
         aria-labelledby="game-result-title"
         className="m-auto w-[calc(100%_-_2rem)] max-w-sm rounded-2xl bg-white p-8 text-center text-black shadow-xl backdrop:bg-black/40"
      >
      <h2 id="game-result-title" className="text-3xl font-bold">
          {resultTitle}
      </h2>

      <p className="mt-2 text-lg text-neutral-600">
         {resultReason}
     </p>

      <button
        type="button"
        onClick={() => resultDialogRef.current?.close()}
        className="mt-6 rounded-lg bg-black px-5 py-2 text-white"
       >
         Close
     </button>
    </dialog>

    <div className="flex flex-1 items-start justify-center px-4 py-6">
      <div className={`mx-auto grid w-full items-start gap-6 ${
    chatOpen
      ? "max-w-6xl grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]"
      : "max-w-xl grid-cols-1"
  }`}>
        <div className="flex w-full min-w-0 max-w-xl flex-col items-center justify-self-center">
         
         

          <div className="mt-2 w-full">
            <ChessBoard
              position={fen}
              onMove={handleMove}
              boardOrientation={playerColor}
              recommendedMove={highlightMoves ? recommendedMove : null}
            />
          </div>

        

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <NewGameDialog onChooseSide={startGame} highlightMoves={highlightMoves} />
             <button
            type="button"
            onClick={() => requestEngineMove("recommend")}
            disabled={!engineReady || isEngineThinking || !isPlayerTurn() || game.isGameOver()}
            className="rounded bg-black px-4 py-2 font-bold text-white hover:bg-gray-600 disabled:opacity-40"
          >
            Recommend a move
          </button>

          </div>
           <p className="mt-2 min-h-5 text-sm font-medium" role="status">
            {recommendedMove
              ? `Recommended move: ${recommendedMove.slice(0, 2)} → ${recommendedMove.slice(2, 4)}`
              : ""}
          </p>
        </div>

    
       <div
  
       hidden={!chatOpen}
       className="w-full min-w-0 lg:self-stretch"
       >
        <MoveChat
        key={round}
        fen={fen}
        recommendedMove={recommendedMove}
        messages={messages}
        setMessages={setMessages}
        onClose={() => setChatOpen(false)}
        />
     </div>
       </div>
    </div>

    <button
      type="button"
      aria-expanded={chatOpen}
      aria-controls="move-explainer"
      onClick={() => setChatOpen((open) => !open)}
      className="fixed bottom-5 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 font-semibold text-white shadow-md hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 3C6.5 3 2 6.6 2 11c0 2.2 1.1 4.2 3 5.7L4 21l4.6-2.5c1.1.3 2.2.5 3.4.5 5.5 0 10-3.6 10-8s-4.5-8-10-8Z" />
      </svg>
      {chatOpen ? "Close Move Explainer" : "Move Explainer"}
    </button>


  </main>
);
}