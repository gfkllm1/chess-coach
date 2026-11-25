"use client";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type SyntheticEvent,
} from "react";
import type { SavedMessage } from "../../lib/autoSave";

type MoveChatProps = {
  fen: string;
  recommendedMove: string | null;
  messages: SavedMessage[];
  setMessages: Dispatch<SetStateAction<SavedMessage[]>>;
  onClose: () => void;

};

export default function MoveChat({
  fen,
  recommendedMove,
  messages,
  setMessages,
  onClose,

}: MoveChatProps) {
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const requestRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const conversation = bottomRef.current?.parentElement;

  conversation?.scrollTo({
    top: conversation.scrollHeight,
    behavior: "smooth",
  });
}, [messages, pending]);

  useEffect(() => {
    return () => requestRef.current?.abort();
  }, []);

  async function sendQuestion(value: string) {
    const question = value.trim();

    if (!question || pending || requestRef.current) return;

    const positionWhenAsked = fen;
    const moveWhenAsked = recommendedMove;

    const controller = new AbortController();
    requestRef.current = controller;

    const userMessage: SavedMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      fen: positionWhenAsked,
      recommended_move: moveWhenAsked,
      created_at: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          fen: positionWhenAsked,
          recommendedMove: moveWhenAsked,
          question,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Could not get a reply.");
      }

      if (
        typeof data?.explanation !== "string" ||
        !data.explanation.trim()
      ) {
        throw new Error("The reply was empty.");
      }

      if (controller.signal.aborted) return;

      const assistantMessage: SavedMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.explanation.trim(),
        fen: positionWhenAsked,
        recommended_move: moveWhenAsked,
        created_at: new Date().toISOString(),
      };

      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      if (controller.signal.aborted) return;

      setDraft(question);
      setError(
        error instanceof Error
          ? error.message
          : "Could not get a reply."
      );
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
      }

      if (!controller.signal.aborted) {
        setPending(false);
      }
    }
  }

  function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    void sendQuestion(draft);
  }

  return (
  <section
    id="move-explainer"
    aria-labelledby="move-explainer-title"
    className="flex h-[36rem] max-h-[75dvh] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-neutral-300 bg-white text-black shadow-sm lg:h-full"
  >
    <header className="shrink-0 border-b border-neutral-200 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="move-explainer-title"
          className="text-xl font-bold"
        >
          Move Explainer
        </h2>

      </div>

  
      <p className="mt-2 text-sm text-neutral-600">
        	Ask about the current board or get a simple explanation of a recommended move.
      </p>


      
    </header>

    <div
      className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-neutral-50 p-4"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
   

      {messages.map((message) => (
        <div
          key={message.id}
          className={`w-fit max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
            message.role === "user"
              ? "ml-auto bg-black text-white"
              : "border border-neutral-200 bg-white text-black"
          }`}
        >
          <p className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>
      ))}

      {pending && (
        <p
          className="text-sm text-neutral-600"
          role="status"
        >
          Writing a reply…
        </p>
      )}

      <div ref={bottomRef} />
    </div>

    <footer className="shrink-0 border-t border-neutral-200 bg-white p-4">
      {recommendedMove && (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            void sendQuestion(
              "Why is this move recommended?"
            )
          }
          className="mb-3 rounded-full border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 disabled:opacity-50"
        >
          Why is this move recommended?
        </button>
      )}

      {error && (
        <p
          className="mb-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
      >
        <input
          aria-label="Question about the board"
          placeholder="Ask about a move…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={500}
          disabled={pending}
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-3 text-sm focus-visible:outline-2 focus-visible:outline-black"
        />

        <button
          type="submit"
          disabled={pending || !draft.trim()}
          className="rounded-lg bg-black px-4 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-40"
        >
          Send
        </button>
      </form>

      <p className="mt-3 text-center text-xs text-neutral-500">
        AI explanations can contain errors.
      </p>
    </footer>
  </section>
);
}