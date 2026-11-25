"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuthUser } from "../../lib/userAuth";
import type { SavedMessage } from "../../lib/autoSave";

type GameRecord = {
  id: string;
  player_color: "white" | "black";
  fen: string;
  pgn: string;
  result: string;
  created_at: string;
  chat_messages: SavedMessage[];
};

const PAGE_SIZE = 10;

function resultLabel(
  result: string,
  playerColor: "white" | "black"
) {
  if (result === "*") return "Unfinished";
  if (result === "1/2-1/2") return "Draw";

  const winner = result === "1-0" ? "white" : "black";
  return winner === playerColor ? "You won" : "Stockfish won";
}

export default function HistoryPage() {
  const { userId, error } = useAuthUser();

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">History</h1>

        <p className="mt-2 text-neutral-600">
          Revisit your games and Move Explainer conversations.
        </p>

        {userId === undefined ? (
          <p className="mt-8" role="status">
            Checking sign-in…
          </p>
        ) : error ? (
          <p className="mt-8 text-red-700" role="alert">
            {error}
          </p>
        ) : userId ? (
          <SavedHistory key={userId} userId={userId} />
        ) : (
          <section className="mt-8 rounded-xl border border-neutral-200 p-8 text-center">
            <h2 className="text-xl font-semibold">
              Sign in to view your history
            </h2>

            <p className="mt-2 text-neutral-600">
              Games and chats are saved automatically while
              you are signed in.
            </p>

            <Link
              href="/account"
              className="mt-6 inline-block rounded-lg bg-black px-4 py-2 font-semibold text-white hover:bg-neutral-800"
            >
              Sign in to view history
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}

function SavedHistory({ userId }: { userId: string }) {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setLoading(true);
      setError("");

      try {
        const { data, error, count } = await supabase
          .from("games")
          .select(
            `
              id,
              player_color,
              fen,
              pgn,
              result,
              created_at,
              chat_messages (
                id,
                role,
                content,
                fen,
                recommended_move,
                created_at
              )
            `,
            { count: "exact" }
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .order("id", { ascending: false })
          .range(
            page * PAGE_SIZE,
            (page + 1) * PAGE_SIZE - 1
          );

        if (error) throw error;
        if (cancelled) return;

        setGames((data ?? []) as GameRecord[]);
        setTotal(count ?? 0);
      } catch (error) {
        console.error("Could not load history:", error);

        if (!cancelled) {
          setError(
            "Could not load your history. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [userId, page, reload]);

  if (loading) {
    return (
      <p className="mt-8" role="status">
        Loading history…
      </p>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <p className="text-red-700" role="alert">
          {error}
        </p>

        <button
          type="button"
          onClick={() => setReload((current) => current + 1)}
          className="mt-3 rounded-lg border border-black px-4 py-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (total === 0) {
    return (
      <section className="mt-8 rounded-xl border border-neutral-200 p-8 text-center">
        <h2 className="text-xl font-semibold">
          No saved games yet
        </h2>

        <p className="mt-2 text-neutral-600">
          Your games and conversations will appear here
          automatically as you play while signed in.
        </p>
      </section>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {games.map((game) => (
        <details
          key={game.id}
          className="rounded-xl border border-neutral-200 bg-white"
        >
          <summary className="cursor-pointer p-5">
            <span className="font-semibold">
              {resultLabel(game.result, game.player_color)}
            </span>

            <span className="ml-3 text-sm text-neutral-600">
              Played as {game.player_color}
            </span>

            <span className="mt-1 block text-sm text-neutral-500">
              {new Date(game.created_at).toLocaleString()}
            </span>
          </summary>

          <div className="space-y-6 border-t border-neutral-200 p-5">
            <section>
              <h3 className="font-semibold">Move history</h3>

              <p className="mt-2 whitespace-pre-wrap break-words text-sm text-neutral-700">
{game.pgn
  .replace(/^\s*\[[^\r\n]*\]\s*$/gm, "")
  .trim() || "No moves recorded."}              </p>
            </section>

            <section>
              <h3 className="font-semibold">
                Move Explainer conversation
              </h3>

              {game.chat_messages.length === 0 ? (
                <p className="mt-2 text-sm text-neutral-500">
                  No conversation for this game.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {[...game.chat_messages]
                    .sort((a, b) =>
                      a.created_at.localeCompare(b.created_at)
                    )
                    .map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-[90%] rounded-xl px-4 py-3 ${
                          message.role === "user"
                            ? "ml-auto bg-black text-white"
                            : "bg-neutral-100"
                        }`}
                      >
                        <p className="mb-1 text-xs font-semibold">
                          {message.role === "user"
                            ? "You"
                            : "Move Explainer"}
                        </p>

                        <p className="whitespace-pre-wrap break-words text-sm">
                          {message.content}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </section>
          </div>
        </details>
      ))}

      {total > PAGE_SIZE && (
        <nav
          aria-label="History pages"
          className="flex items-center justify-between pt-4"
        >
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-black px-4 py-2 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm">
            Page {page + 1} of {Math.ceil(total / PAGE_SIZE)}
          </span>

          <button
            type="button"
            disabled={(page + 1) * PAGE_SIZE >= total}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-black px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}