begin;

-- Saved chess games
create table public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  player_color text not null
    check (player_color in ('white', 'black')),
  pgn text not null default '',
  fen text not null,
  result text not null default '*'
    check (result in ('*', '1-0', '0-1', '1/2-1/2')),
  created_at timestamptz not null default now()
);

-- Conversations associated with a game
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  fen text not null,
  recommended_move text,
  created_at timestamptz not null default now()
);

create index games_user_id_idx
  on public.games(user_id);

create index chat_messages_game_id_idx
  on public.chat_messages(game_id);

-- Enable access rules
alter table public.games enable row level security;
alter table public.chat_messages enable row level security;

-- Signed-in players can manage only their own games
create policy "Players manage their own games"
on public.games
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Messages are accessible only through a game the player owns
create policy "Players manage messages in their own games"
on public.chat_messages
for all
to authenticated
using (
  exists (
    select 1
    from public.games
    where games.id = chat_messages.game_id
      and games.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.games
    where games.id = chat_messages.game_id
      and games.user_id = (select auth.uid())
  )
);

-- Database permissions; the policies above restrict individual rows
revoke all on public.games, public.chat_messages from anon;
grant select, insert, update, delete
  on public.games, public.chat_messages
  to authenticated;

commit;