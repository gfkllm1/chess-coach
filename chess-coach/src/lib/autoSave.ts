'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabase';

export type SavedMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  fen: string;
  recommended_move: string | null;
  created_at: string;
};

type AutoSaveProps = {
  userId: string | null;
  round: number;
  playerColor: 'white' | 'black';
  fen: string;
  pgn: string;
  result: string;
  messages: SavedMessage[];
};

export function useGameAutoSave({ userId, round, playerColor, fen, pgn, result, messages }: AutoSaveProps) {
  const identityRef = useRef<{
    key: string;
    id: string;
  } | null>(null);

  // Process writes in order.
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const latestSaveRef = useRef(0);

  const [saveStatus, setSaveStatus] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!userId) return;

    const key = `${userId}:${round}`;

    if (identityRef.current?.key !== key) {
      identityRef.current = {
        key,
        id: crypto.randomUUID(),
      };
    }

    const gameId = identityRef.current.id;
    const saveNumber = ++latestSaveRef.current;

    // Capture values now so subsequent moves cannot alter this save.
    const gameRecord = {
      id: gameId,
      user_id: userId,
      player_color: playerColor,
      fen,
      pgn,
      result,
    };

    const messageRecords = messages.map(message => ({
      ...message,
      game_id: gameId,
    }));

    setSaveStatus('Saving automatically…');
    setSaveError('');

    const task = queueRef.current.then(async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || data.session?.user.id !== userId) {
        throw new Error('Your sign-in session changed.');
      }

      // The game must exist before its messages are inserted.
      const { error: gameError } = await supabase.from('games').upsert(gameRecord, { onConflict: 'id' });

      if (gameError) throw gameError;

      if (messageRecords.length > 0) {
        const { error: messageError } = await supabase.from('chat_messages').upsert(messageRecords, { onConflict: 'id' });

        if (messageError) throw messageError;
      }
    });

    // A failed save must not block later saves.
    queueRef.current = task.catch(() => {});

    void task.then(
      () => {
        if (saveNumber !== latestSaveRef.current) return;

        setSaveStatus('All changes saved.');
        setSaveError('');
      },
      (error: unknown) => {
        console.error('Automatic save failed:', error);

        if (saveNumber !== latestSaveRef.current) return;

        setSaveStatus('');
        setSaveError('Automatic saving failed. Check your connection. ' + 'The app will try again after your next move or message.');
      },
    );
  }, [userId, round, playerColor, fen, pgn, result, messages]);

  return { saveStatus, saveError };
}
