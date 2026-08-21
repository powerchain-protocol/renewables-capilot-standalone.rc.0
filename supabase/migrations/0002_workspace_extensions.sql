create table if not exists public.wallet_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chain text not null check (chain in ('solana','sui')),
  address text not null,
  label text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique(chain,address)
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  kind text not null check (kind in ('grant','usage','refund','reservation')),
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_ai_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider text not null default 'auto',
  model_profile text not null default 'balanced',
  fallback_enabled boolean not null default true,
  enabled_agents text[] not null default '{}',
  enabled_skills text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.wallet_accounts enable row level security;
alter table public.credit_ledger enable row level security;
alter table public.user_ai_preferences enable row level security;

revoke all on table public.wallet_accounts, public.credit_ledger, public.user_ai_preferences from anon;
grant select,insert,update,delete on table public.wallet_accounts to authenticated;
grant select on table public.credit_ledger to authenticated;
grant select,insert,update,delete on table public.user_ai_preferences to authenticated;
grant all on table public.wallet_accounts, public.credit_ledger, public.user_ai_preferences to service_role;

create policy "wallet accounts self" on public.wallet_accounts for all to authenticated
  using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "credit ledger self" on public.credit_ledger for select to authenticated
  using ((select auth.uid())=user_id);
create policy "ai preferences self" on public.user_ai_preferences for all to authenticated
  using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

create index if not exists wallet_accounts_user_idx on public.wallet_accounts(user_id,created_at desc);
create index if not exists credit_ledger_user_idx on public.credit_ledger(user_id,created_at desc);
