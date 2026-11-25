'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export function useAuthUser() {
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let receivedEvent = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      receivedEvent = true;

      if (active) {
        setUserId(session?.user.id ?? null);
        setError('');
      }
    });

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active || receivedEvent) return;
        if (error) throw error;

        setUserId(data.session?.user.id ?? null);
      })
      .catch(() => {
        if (!active || receivedEvent) return;

        setError('Could not check your sign-in status. Please reload.');
        setUserId(null);
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { userId, error };
}
