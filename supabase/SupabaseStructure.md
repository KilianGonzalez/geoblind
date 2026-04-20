-- ============================================================
-- 1. COUNTRIES — catálogo estático mundial
-- ============================================================
create table countries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  iso_code     text not null unique,       -- ISO 3166-1 alpha-2 (ES, FR, BR...)
  lat          float not null,             -- centroide
  lng          float not null,
  continent    text not null,
  region       text not null,              -- Europa del Norte, Sudamérica, etc.
  neighbor_codes text[] default '{}',      -- array de iso_codes vecinos
  population   int,
  area_km2     float,
  flag_emoji   text
);

-- ============================================================
-- 2. GAME_MODES — modos de juego configurables
-- ============================================================
create table game_modes (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,   -- 'daily','infinite','region','timed','hard'
  label            text not null,
  time_limit_sec   int default null,       -- null = sin límite
  show_color_hints bool not null default true,
  show_direction   bool not null default true,
  max_attempts     int default null        -- null = ilimitado
);

insert into game_modes (slug, label, time_limit_sec, show_color_hints, show_direction, max_attempts) values
  ('daily',    'Diario',         null, true,  true,  6),
  ('infinite', 'Infinito',       null, true,  true,  null),
  ('region',   'Por Región',     null, true,  true,  null),
  ('timed',    'Contrarreloj',   60,   true,  true,  null),
  ('hard',     'Difícil',        null, false, false, 6);

-- ============================================================
-- 3. DAILY_CHALLENGES — reto del día por modo
-- ============================================================
create table daily_challenges (
  id               uuid primary key default gen_random_uuid(),
  country_id       uuid not null references countries(id),
  game_mode_id     uuid not null references game_modes(id),
  challenge_date   date not null,
  ai_hint_theme    text,                   -- tema generado por IA ("países insulares", etc.)
  unique(game_mode_id, challenge_date)
);

-- ============================================================
-- 4. PROFILES — extensión de auth.users
-- ============================================================
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  avatar_url  text,
  created_at  timestamp with time zone default now()
);

-- Trigger: crea perfil automáticamente al registrarse
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- 5. GAME_SESSIONS — cada partida jugada
-- ============================================================
create table game_sessions (
  id                  uuid primary key default gen_random_uuid(),
  profile_id          uuid references profiles(id) on delete set null,  -- null = anónimo
  game_mode_id        uuid not null references game_modes(id),
  country_id          uuid not null references countries(id),
  daily_challenge_id  uuid references daily_challenges(id),
  is_anonymous        bool not null default true,
  completed           bool not null default false,
  won                 bool not null default false,
  attempts_used       int not null default 0,
  time_elapsed_sec    int,
  score               float,                -- calculada al cerrar la sesión
  played_at           timestamp with time zone default now()
);

-- ============================================================
-- 6. GUESSES — cada intento dentro de una partida
-- ============================================================
create table guesses (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references game_sessions(id) on delete cascade,
  country_id     uuid not null references countries(id),
  attempt_number int not null,
  distance_km    float not null,
  direction      text,                      -- 'N','NE','E','SE','S','SO','O','NO'
  proximity_pct  float not null,           -- 0–100, para el color de temperatura
  guessed_at     timestamp with time zone default now()
);

-- ============================================================
-- 7. RANKINGS — puntuación agregada por usuario y modo
-- ============================================================
create table rankings (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  game_mode_id    uuid not null references game_modes(id),
  total_score     float not null default 0,
  games_played    int not null default 0,
  games_won       int not null default 0,
  current_streak  int not null default 0,
  best_streak     int not null default 0,
  avg_attempts    float not null default 0,
  updated_at      timestamp with time zone default now(),
  unique(profile_id, game_mode_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table profiles      enable row level security;
alter table game_sessions enable row level security;
alter table guesses       enable row level security;
alter table rankings      enable row level security;

-- Profiles: cada usuario ve y edita solo el suyo
create policy "profiles_select" on profiles for select using (true);
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- Sessions: lectura pública, escritura solo del propietario
create policy "sessions_select" on game_sessions for select using (true);
create policy "sessions_insert" on game_sessions for insert with check (true);
create policy "sessions_update" on game_sessions for update using (profile_id = auth.uid() or is_anonymous);

-- Guesses: lectura pública, escritura vinculada a su sesión
create policy "guesses_select" on guesses for select using (true);
create policy "guesses_insert" on guesses for insert with check (true);

-- Rankings: lectura pública, escritura solo interna (via función)
create policy "rankings_select" on rankings for select using (true);

-- ============================================================
-- FUNCIÓN: calcular y actualizar ranking al cerrar sesión
-- ============================================================
create or replace function update_ranking_on_session_close()
returns trigger as $$
begin
  if new.completed = true and new.profile_id is not null then
    insert into rankings (profile_id, game_mode_id, total_score, games_played, games_won, avg_attempts)
    values (new.profile_id, new.game_mode_id, coalesce(new.score,0), 1,
            case when new.won then 1 else 0 end, new.attempts_used)
    on conflict (profile_id, game_mode_id) do update set
      total_score    = rankings.total_score + coalesce(new.score, 0),
      games_played   = rankings.games_played + 1,
      games_won      = rankings.games_won + case when new.won then 1 else 0 end,
      avg_attempts   = (rankings.avg_attempts * rankings.games_played + new.attempts_used) / (rankings.games_played + 1),
      current_streak = case when new.won then rankings.current_streak + 1 else 0 end,
      best_streak    = greatest(rankings.best_streak, case when new.won then rankings.current_streak + 1 else rankings.best_streak end),
      updated_at     = now();
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_session_completed
  after update on game_sessions
  for each row
  when (old.completed = false and new.completed = true)
  execute procedure update_ranking_on_session_close();