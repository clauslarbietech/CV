-- FitLife AI Coach — initial relational schema
-- Run against Supabase Postgres. Enable RLS on all user tables.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  email text,
  age int,
  sex text,
  height_cm numeric,
  current_weight_kg numeric,
  goal_weight_kg numeric,
  primary_goal text,
  experience_level text,
  activity_level text,
  workout_location text,
  equipment text[] not null default '{}',
  training_days_per_week int,
  preferred_duration_min int,
  dietary_preference text,
  food_allergies text[] not null default '{}',
  physical_limitations text[] not null default '{}',
  injuries text[] not null default '{}',
  onboarding_completed boolean not null default false,
  xp int not null default 0,
  rank text not null default 'Recruit',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.coach_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  personality text not null default 'motivator',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id)
);

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  notifications_enabled boolean not null default true,
  units text not null default 'metric',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id)
);

create table if not exists public.fitness_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  goal_type text not null,
  target_weight_kg numeric,
  target_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Catalog
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  subtitle text,
  categories text[] not null default '{}',
  duration_days int not null,
  equipment text,
  average_workout text,
  difficulty text,
  goals text[] not null default '{}',
  featured boolean not null default false,
  military_themed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.program_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  day_number int not null,
  title text not null,
  focus text[] not null default '{}',
  rounds int,
  rest_min_sec int,
  rest_max_sec int,
  estimated_min int,
  estimated_max int,
  is_recovery boolean not null default false,
  is_final_test boolean not null default false,
  coach_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (program_id, day_number)
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  muscle_groups text[] not null default '{}',
  equipment text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  program_day_id uuid not null references public.program_days (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id),
  sort_order int not null default 0,
  reps text,
  duration_sec int,
  per_side boolean not null default false,
  recruit_reps text,
  soldier_reps text,
  elite_reps text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  program_id uuid not null references public.programs (id),
  current_day int not null default 1,
  difficulty text not null default 'soldier',
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  program_id uuid references public.programs (id),
  program_day int,
  started_at timestamptz not null,
  completed_at timestamptz,
  duration_sec int,
  difficulty_rating int,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.exercise_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.workout_sessions (id) on delete cascade,
  exercise_name text not null,
  reps_completed int,
  duration_sec int,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Nutrition
create table if not exists public.nutrition_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  calories int,
  protein_g int,
  carbs_g int,
  fat_g int,
  fiber_g int,
  water_ml int,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id)
);

create table if not exists public.daily_nutrition (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  calories int not null default 0,
  protein_g int not null default 0,
  carbs_g int not null default 0,
  fat_g int not null default 0,
  fiber_g int not null default 0,
  water_ml int not null default 0,
  nutrition_score int,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, date)
);

create table if not exists public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  logged_at timestamptz not null default timezone('utc', now()),
  source text not null default 'text',
  raw_input text,
  photo_path text,
  goal_match_score int,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_log_id uuid not null references public.meal_logs (id) on delete cascade,
  name text not null,
  calories numeric,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  fiber_g numeric,
  user_corrected boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Wellness / progress
create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  sleep_quality int,
  soreness int,
  energy int,
  motivation int,
  stress int,
  weight_kg numeric,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, date)
);

create table if not exists public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recorded_at date not null,
  weight_kg numeric,
  waist_cm numeric,
  chest_cm numeric,
  arms_cm numeric,
  legs_cm numeric,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null,
  taken_at date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Gamification
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  achievement_id uuid not null references public.achievements (id),
  earned_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, achievement_id)
);

create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount int not null,
  reason text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  workout_streak int not null default 0,
  activity_streak int not null default 0,
  nutrition_streak int not null default 0,
  longest_workout_streak int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id)
);

-- Adherence (tracking only — no medical advice)
create table if not exists public.supplements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  dose text,
  schedule_time time,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.supplement_logs (
  id uuid primary key default gen_random_uuid(),
  supplement_id uuid not null references public.supplements (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  taken_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.medication_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  dose text,
  taken_at timestamptz,
  status text not null default 'logged',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- AI
create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations (id) on delete cascade,
  role text not null,
  content text not null,
  token_count int,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ai_usage_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  request_count int not null default 0,
  token_count int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, date)
);

-- Wearables / notifications / subscriptions (future)
create table if not exists public.wearable_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  provider text not null,
  status text not null default 'disconnected',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.wearable_daily_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  steps int,
  active_calories int,
  resting_hr int,
  sleep_hours numeric,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, date)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_code text not null default 'free',
  status text not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id)
);

-- RLS helpers
alter table public.profiles enable row level security;
alter table public.coach_preferences enable row level security;
alter table public.user_preferences enable row level security;
alter table public.fitness_goals enable row level security;
alter table public.user_programs enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.nutrition_goals enable row level security;
alter table public.daily_nutrition enable row level security;
alter table public.meal_logs enable row level security;
alter table public.meal_items enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.body_measurements enable row level security;
alter table public.progress_photos enable row level security;
alter table public.user_achievements enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.streaks enable row level security;
alter table public.supplements enable row level security;
alter table public.supplement_logs enable row level security;
alter table public.medication_logs enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.ai_usage_daily enable row level security;
alter table public.wearable_connections enable row level security;
alter table public.wearable_daily_metrics enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;

create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "coach_prefs_own" on public.coach_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_prefs_own" on public.user_preferences
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "fitness_goals_own" on public.fitness_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_programs_own" on public.user_programs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "sessions_own" on public.workout_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "nutrition_goals_own" on public.nutrition_goals
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "daily_nutrition_own" on public.daily_nutrition
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "meal_logs_own" on public.meal_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "checkins_own" on public.daily_checkins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "measurements_own" on public.body_measurements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "achievements_own" on public.user_achievements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "xp_own" on public.xp_transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "streaks_own" on public.streaks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_conversations_own" on public.ai_conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_usage_own" on public.ai_usage_daily
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "subscriptions_own" on public.subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public read for program catalog
alter table public.programs enable row level security;
alter table public.program_days enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.achievements enable row level security;

create policy "programs_read" on public.programs for select using (true);
create policy "program_days_read" on public.program_days for select using (true);
create policy "exercises_read" on public.exercises for select using (true);
create policy "workout_exercises_read" on public.workout_exercises for select using (true);
create policy "achievements_read" on public.achievements for select using (true);

insert into public.achievements (code, name, description)
values ('iron_14', 'IRON 14 BADGE', 'Complete OPERATION IRON 14')
on conflict (code) do nothing;
