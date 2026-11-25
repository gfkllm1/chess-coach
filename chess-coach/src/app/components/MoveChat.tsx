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
};

export default function MoveChat({
  fen,
  recommendedMove,
  messages,
  setMessages,
}: MoveChatProps) {
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const requestRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
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
      className="w-full rounded-xl border border-neutral-300 bg-white p-4 text-black shadow-lg lg:fixed lg:bottom-24 lg:right-5 lg:z-10 lg:w-[22rem]"
    >
      <h2
        id="move-explainer-title"
        className="text-lg font-bold"
      >
        Move Explainer
      </h2>

      <p className="mt-1 text-sm text-neutral-600">
        Ask about the current position. AI explanations can contain errors.
      </p>

      {recommendedMove && (
        <div className="mt-3">
      

          <button
            type="button"
            disabled={pending}
            onClick={() =>
              void sendQuestion(
                "Why is this move recommended?"
              )
            }
            className="mt-2 rounded-full border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-100 disabled:opacity-50"
          >
            Why is this move recommended?
          </button>
        </div>
      )}

      <div
        className="mt-4 max-h-[40vh] space-y-3 overflow-y-auto"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`w-fit max-w-[90%] rounded-xl px-3 py-2 text-sm ${
              message.role === "user"
                ? "ml-auto bg-black text-white"
                : "bg-neutral-100 text-black"
            }`}
          >
            <p className="mb-1 text-xs font-semibold">
              {message.role === "user"
                ? "You"
                : "Move Explainer"}
            </p>

            <p className="whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        ))}

        {pending && (
          <p className="text-sm text-neutral-600" role="status">
            Writing a reply…
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex gap-2"
      >
        <input
          aria-label="Question about the board"
          placeholder="Ask about a move…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={500}
          disabled={pending}
          className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
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