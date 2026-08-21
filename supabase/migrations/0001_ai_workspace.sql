create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New analysis',
  mode text not null default 'analyze' check (mode in ('analyze','forecast','compare','optimize','audit','build')),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  role text not null check (role in ('user','assistant','system','tool')),
  content text not null,
  provider text,
  model text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_prompts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  provider text not null,
  model text not null,
  status text not null check (status in ('started','completed','failed')),
  input_tokens bigint,
  output_tokens bigint,
  latency_ms integer,
  error_code text,
  trace_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.data_sources (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  type text not null,
  name text not null,
  status text not null default 'active',
  config jsonb not null default '{}'::jsonb,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.saved_prompts enable row level security;
alter table public.ai_runs enable row level security;
alter table public.data_sources enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.conversations from anon;
revoke all on table public.messages from anon;
revoke all on table public.saved_prompts from anon;
revoke all on table public.ai_runs from anon;
revoke all on table public.data_sources from anon;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.conversations to authenticated;
grant select, insert, update, delete on table public.messages to authenticated;
grant select, insert, update, delete on table public.saved_prompts to authenticated;
grant select on table public.ai_runs to authenticated;
grant select, insert, update, delete on table public.data_sources to authenticated;

grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.conversations to service_role;
grant select, insert, update, delete on table public.messages to service_role;
grant select, insert, update, delete on table public.saved_prompts to service_role;
grant select, insert, update, delete on table public.ai_runs to service_role;
grant select, insert, update, delete on table public.data_sources to service_role;

create policy "profiles self" on public.profiles
  for all to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "conversations self" on public.conversations
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "messages through own conversation" on public.messages
  for all to authenticated
  using (exists(select 1 from public.conversations c where c.id=conversation_id and c.user_id=(select auth.uid())))
  with check (exists(select 1 from public.conversations c where c.id=conversation_id and c.user_id=(select auth.uid())));

create policy "prompts self" on public.saved_prompts
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "runs self" on public.ai_runs
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "sources self" on public.data_sources
  for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create index if not exists conversations_user_updated_idx on public.conversations(user_id, updated_at desc);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at);
create index if not exists prompts_user_created_idx on public.saved_prompts(user_id, created_at desc);
