"use client";

import { useState, type SubmitEvent } from "react";

type MoveChatProps = {
  fen: string;
  recommendedMove: string | null;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function MoveChat({ fen, recommendedMove }: MoveChatProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = draft.trim();
    if (!question || pending) return;

    const positionWhenAsked = fen;

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: question },
    ]);
    setDraft("");
    setError("");
    setPending(true);

    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fen: positionWhenAsked,
          question,
          recommendedMove
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not get a reply.");
      }

      if (typeof data.explanation !== "string" || !data.explanation.trim()) {
        throw new Error("The reply was empty.");
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.explanation,
        },
      ]);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not get a reply.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      id="move-explainer"
      aria-labelledby="move-explainer-heading"
className="flex h-[32rem] w-full max-w-sm flex-col rounded-xl border border-neutral-300 bg-white p-4 text-black shadow-md"    >
      <h2 id="move-explainer-heading" className="text-lg font-semibold">
        Move Explainer
      </h2>

      <p className="mt-1 text-sm text-neutral-600">
        {recommendedMove
          ? `Stockfish suggests ${recommendedMove.slice(0, 2)} → ${recommendedMove.slice(2, 4)}`
          : "Ask about the current position."}
      </p>

      <div
className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto"        role="log"
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <p
            key={message.id}
            className={`w-fit max-w-[90%] whitespace-pre-wrap break-words rounded-xl px-3 py-2 text-sm ${
              message.role === "user"
                ? "ml-auto bg-black text-white"
                : "mr-auto bg-neutral-100 text-black"
            }`}
          >
            {message.content}
          </p>
        ))}
      </div>

      {pending && (
        <p className="mt-2 text-sm text-neutral-600" role="status">
          Writing a reply…
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          aria-label="Question about the board"
          placeholder="Ask about a move…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={500}
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black"
        />

        <button
          type="submit"
          disabled={pending || !draft.trim()}
          className="rounded-lg bg-black px-3 py-2 text-sm text-white disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </section>
  );
}