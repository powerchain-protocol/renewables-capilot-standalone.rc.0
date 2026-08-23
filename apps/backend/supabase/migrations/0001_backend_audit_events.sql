create table if not exists public.backend_audit_events (
  id text primary key,
  request_id text not null,
  service text not null,
  action text not null,
  status text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists backend_audit_events_request_id_idx
  on public.backend_audit_events (request_id);

create index if not exists backend_audit_events_service_created_at_idx
  on public.backend_audit_events (service, created_at desc);

alter table public.backend_audit_events enable row level security;
revoke all on table public.backend_audit_events from anon, authenticated;
grant all on table public.backend_audit_events to service_role;
