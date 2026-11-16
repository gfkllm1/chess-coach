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
      {
      <button
       type="button"
       onClick={() => {dialogRef.current?.showModal(); setHighlightChoice(highlightMoves);}} className="mx-auto mt-4 block rounded bg-black px-4 py-2 font-bold text-white hover:bg-gray-600">
       New Game
      </button>
}
      <dialog ref={dialogRef} className="m-auto w-[calc(100%_-_2rem)] max-w-md rounded-lg p-6">
        <h2 className="mx-auto text-lg font-semibold">Choose Your Side</h2>

        <div className="my-4 flex items-center justify-between gap-4">
  <span id="highlight-moves-label" className="text-sm">
    Highlight recommended moves
  </span>

  <button
    type="button"
    role="switch"
    aria-checked={highlightChoice}
    aria-labelledby="highlight-moves-label"
    onClick={() => setHighlightChoice((current) => !current)}
    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
      highlightChoice ? "bg-black" : "bg-neutral-400"
    }`}
  >
    <span
      aria-hidden="true"
      className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
        highlightChoice ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
</div>
        <div className="flex justify-center gap-4">
          
          <button
            type="button"
            onClick={() => {
              onChooseSide("white", highlightChoice);
              dialogRef.current?.close();

            }}
            className=" rounded bg-white px-4 py-2 text-black hover:bg-gray-200"
          >
            White
          </button>

          <button
            type="button"
            onClick={() => {
              onChooseSide("black",highlightChoice);
              dialogRef.current?.close();
            }}
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Black
          </button>
                    </div>

           <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className=" mt-4 block rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
          >
            Cancel
          </button>

      </dialog>
      </>
    );

        
}

