"use client";

import { useState } from "react";

export default function MoveChat() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = draft.trim();
     if (!message) return;

    setMessages((current) => [...current, message]);
    setDraft("");
  }

  return (
    <section
      id="move-explainer"
      className="fixed bottom-24 right-5 z-10 w-[calc(100%-2.5rem)] max-w-sm rounded-xl border border-neutral-200 bg-white p-4 shadow-lg"
    >
      <h2>Move Explainer</h2>
      <p>Ask about the current position.</p>
      <div className="mt-4 max-h-48 space-y-2 overflow-y-auto" role="log" aria-label="Chat messages">
        {messages.map((message, index) => (
          <p
            key={index}
            className="ml-auto w-fit max-w-[90%] break-words rounded-xl bg-black px-3 py-2 text-sm text-white"
          >
            {message}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          aria-label="Question about the board"
          placeholder="Ask about a move…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </section>
  );
}