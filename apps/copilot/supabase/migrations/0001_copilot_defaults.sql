-- PowerChain Copilot baseline security posture.
-- Prisma owns relational schema creation; this migration enables RLS after tables exist.

do $$
declare
  relation_name text;
begin
  foreach relation_name in array array[
    'copilot_users',
    'copilot_organizations',
    'copilot_memberships',
    'copilot_chats',
    'copilot_messages',
    'copilot_reports',
    'copilot_runs',
    'copilot_credit_ledger'
  ] loop
    if to_regclass('public.' || relation_name) is not null then
      execute format('alter table public.%I enable row level security', relation_name);
    end if;
  end loop;
end $$;
