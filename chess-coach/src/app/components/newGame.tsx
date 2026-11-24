"use client";

import { useRef, useState } from 'react';

export default function NewGameDialog({
  onChooseSide,
  highlightMoves,
}: {
  onChooseSide: (color: "white" | "black", highlight: boolean) => void;
  highlightMoves: boolean;
}) {
    
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [highlightChoice, setHighlightChoice] = useState(highlightMoves);

    
  return (
  <>
    <button
      type="button"
      onClick={() => {
        setHighlightChoice(highlightMoves);
        dialogRef.current?.showModal();
      }}
      className="mx-auto mt-4 block rounded-lg bg-black px-4 py-2 font-bold text-white hover:bg-neutral-800"
    >
      New Game
    </button>

    <dialog
      ref={dialogRef}
      aria-labelledby="new-game-title"
      aria-describedby="new-game-description"
      className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-xl border border-neutral-200 bg-white p-6 text-black shadow-xl backdrop:bg-black/40"
    >
      <h2 id="new-game-title" className="text-2xl font-bold">
        New game
      </h2>

      <p className="mt-2 font-medium text-neutral-600">
        Choose your side
      </p>

     

      <div className="mt-6 grid grid-cols-2 gap-3">

        <button
          type="button"
          onClick={() => {
            onChooseSide("white", highlightChoice);
            dialogRef.current?.close();
          }}
          className="min-h-12 rounded-lg border border-neutral-400 bg-white px-3 py-3 font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Play as White
        </button>

        <button
          type="button"
          onClick={() => {
            onChooseSide("black", highlightChoice);
            dialogRef.current?.close();
          }}
          className="min-h-12 rounded-lg bg-black px-3 py-3 font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Play as Black
        </button>

        
      </div>

      <div className="mt-6 border-t border-neutral-200 pt-5">
        <div className="flex items-center justify-between gap-4">
          <span
            id="highlight-moves-label"
            className="text-sm font-semibold "
          >
            Highlight recommended moves
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={highlightChoice}
            aria-labelledby="highlight-moves-label"
            aria-describedby="highlight-moves-description"
            onClick={() => setHighlightChoice((current) => !current)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
              highlightChoice ? "bg-black" : "bg-neutral-400"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                highlightChoice ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <p
          id="highlight-moves-description"
          className="mt-2 text-sm text-neutral-600"
        >
          Show the suggested move on the board.
        </p>
      </div>

      <button
        type="button"
        onClick={() => dialogRef.current?.close()}
        className="mt-6 rounded-lg px-3 py-2 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        Cancel
      </button>
    </dialog>
  </>
);

        
}

