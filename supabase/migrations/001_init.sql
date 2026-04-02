-- Profiles (auto-created on signup)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  profession text,
  city text,
  created_at timestamptz default now()
);

-- Onboarding data
create table if not exists onboarding_data (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  specialisation text,
  ideal_client text,
  outcome text,
  differentiator text,
  years_experience text,
  origin_story text,
  contact_preference text,
  created_at timestamptz default now()
);

-- Generated pages
create table if not exists pages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  slug text unique not null,
  first_name text,
  profession text,
  city text,
  tagline text,
  bio text,
  services text[],
  contact_preference text,  
  contact_value text,
  accent_colour text default '#000000',
  published_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table onboarding_data enable row level security;
alter table pages enable row level security;

create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can read own onboarding" on onboarding_data for select using (auth.uid() = user_id);
create policy "Users can insert own onboarding" on onboarding_data for insert with check (auth.uid() = user_id);
create policy "Anyone can read pages" on pages for select using (true);
create policy "Users can insert own page" on pages for insert with check (auth.uid() = user_id);
create policy "Users can update own page" on pages for update using (auth.uid() = user_id);
