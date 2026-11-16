"use client";

import { useRef } from 'react';

export default function NewGameDialog({
  onChooseSide,
}: {
  onChooseSide: (color: "white" | "black") => void;
}) {
    
  const dialogRef = useRef<HTMLDialogElement>(null);

    
  return (
      <>
      {
      <button
       type="button"
       onClick={() => dialogRef.current?.showModal()} className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
       New Game
      </button>
}
      <dialog ref={dialogRef} className="rounded-lg p-6">
        <h2 className="mb-4 text-lg font-semibold">Choose Your Side</h2>
        <div className="flex justify-center gap-4">
          
          <button
            type="button"
            onClick={() => {
              onChooseSide("white");
              dialogRef.current?.close();
            }}
            className="rounded bg-white px-4 py-2 text-black hover:bg-gray-200"
          >
            White
          </button>

          <button
            type="button"
            onClick={() => {
              onChooseSide("black");
              dialogRef.current?.close();
            }}
            className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Black
          </button>

           <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded bg-gray-300 px-4 py-2 text-black hover:bg-gray-400"
          >
            Cancel
          </button>
            
        </div>
      </dialog>
      </>
    );

        
}

