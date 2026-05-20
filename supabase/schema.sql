-- ============================================================
-- ReplyGenius — Supabase Database Schema
-- Paste this into: supabase.com → SQL Editor → Run
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users (extends Supabase auth.users) ────────────────────
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  full_name     text,
  email         text,
  plan          text not null default 'free'
                  check (plan in ('free','creator','business','agency')),
  business_name text,
  language      text not null default 'en' check (language in ('en','ms')),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Connected Social Accounts ───────────────────────────────
create table public.connected_accounts (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references public.profiles(id) on delete cascade not null,
  platform        text not null check (platform in ('facebook','instagram','youtube','tiktok')),
  account_name    text not null,
  handle          text,
  page_id         text,                    -- FB Page ID or IG Business Account ID
  access_token    text,                    -- encrypted in production!
  token_expires   timestamptz,
  connected       boolean default false,
  followers_count integer default 0,
  status          text default 'disconnected'
                    check (status in ('connected','limited','disconnected')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique(user_id, platform, page_id)
);

-- ── Comments / Messages ─────────────────────────────────────
create table public.comments (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid references public.profiles(id) on delete cascade not null,
  account_id       uuid references public.connected_accounts(id) on delete cascade,
  external_id      text not null,           -- Meta/TikTok/YT comment ID
  platform         text not null check (platform in ('facebook','instagram','youtube','tiktok')),
  source_type      text not null default 'comment' check (source_type in ('comment','dm')),
  username         text not null,
  user_initials    text,
  account_name     text,
  text             text not null,
  sentiment        text check (sentiment in ('positive','neutral','negative','question')),
  language         text default 'en' check (language in ('en','ms','id')),
  status           text not null default 'pending'
                     check (status in ('pending','replied','approved','spam','escalated')),
  is_read          boolean default false,
  post_id          text,
  post_caption     text,
  post_color       text,
  timestamp        timestamptz not null,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  unique(account_id, external_id)
);

-- ── AI Reply Suggestions ────────────────────────────────────
create table public.ai_suggestions (
  id          uuid primary key default uuid_generate_v4(),
  comment_id  uuid references public.comments(id) on delete cascade not null,
  tone        text not null check (tone in ('friendly','professional','sales')),
  text        text not null,
  created_at  timestamptz default now()
);

-- ── Replies (sent) ──────────────────────────────────────────
create table public.replies (
  id              uuid primary key default uuid_generate_v4(),
  comment_id      uuid references public.comments(id) on delete cascade not null,
  user_id         uuid references public.profiles(id) not null,
  text            text not null,
  ai_generated    boolean default false,
  tone_used       text,
  external_reply_id text,                  -- ID returned by Meta/YT/TT API
  sent_at         timestamptz default now()
);

-- ── Templates ───────────────────────────────────────────────
create table public.templates (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  category    text not null,
  title       text not null,
  body        text not null,
  language    text default 'en',
  use_count   integer default 0,
  created_at  timestamptz default now()
);

-- ── Auto-Reply Rules ─────────────────────────────────────────
create table public.auto_rules (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  name        text not null,
  description text,
  rule_type   text not null,               -- 'faq'|'thank_you'|'delivery'|'hours'|'spam'|'lead'
  enabled     boolean default false,
  config      jsonb default '{}',          -- rule-specific config
  created_at  timestamptz default now()
);

-- ── Analytics Snapshots (daily) ─────────────────────────────
create table public.analytics_daily (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid references public.profiles(id) on delete cascade not null,
  date              date not null,
  platform          text,
  total_comments    integer default 0,
  replied           integer default 0,
  ai_generated      integer default 0,
  leads             integer default 0,
  complaints        integer default 0,
  spam_blocked      integer default 0,
  avg_response_secs integer,
  unique(user_id, date, platform)
);

-- ── Row Level Security ───────────────────────────────────────
alter table public.profiles           enable row level security;
alter table public.connected_accounts enable row level security;
alter table public.comments           enable row level security;
alter table public.ai_suggestions     enable row level security;
alter table public.replies            enable row level security;
alter table public.templates          enable row level security;
alter table public.auto_rules         enable row level security;
alter table public.analytics_daily    enable row level security;

-- Profiles: users can only see/edit their own
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);

-- Connected accounts: own only
create policy "accounts_own" on public.connected_accounts
  for all using (auth.uid() = user_id);

-- Comments: own only
create policy "comments_own" on public.comments
  for all using (auth.uid() = user_id);

-- AI suggestions: via comment ownership
create policy "suggestions_own" on public.ai_suggestions
  for all using (
    exists (select 1 from public.comments c where c.id = comment_id and c.user_id = auth.uid())
  );

-- Replies: own only
create policy "replies_own" on public.replies
  for all using (auth.uid() = user_id);

-- Templates: own only
create policy "templates_own" on public.templates
  for all using (auth.uid() = user_id);

-- Rules: own only
create policy "rules_own" on public.auto_rules
  for all using (auth.uid() = user_id);

-- Analytics: own only
create policy "analytics_own" on public.analytics_daily
  for all using (auth.uid() = user_id);

-- ── Indexes ──────────────────────────────────────────────────
create index idx_comments_user_status  on public.comments(user_id, status);
create index idx_comments_platform     on public.comments(platform);
create index idx_comments_timestamp    on public.comments(timestamp desc);
create index idx_replies_comment       on public.replies(comment_id);
create index idx_analytics_user_date   on public.analytics_daily(user_id, date desc);

-- ── Done ─────────────────────────────────────────────────────
-- Run this once in Supabase SQL Editor.
-- Then go to: Authentication → Email → Enable email signups
-- Storage: not needed for MVP1
