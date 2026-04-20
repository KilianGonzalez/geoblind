-- Fixes Supabase signup failures caused by a stale trigger that writes to
-- profiles.user_id even though the table now uses profiles.id.

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, created_at)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
      nullif(split_part(new.email, '@', 1), ''),
      'Jugador'
    ),
    now()
  )
  on conflict (id) do update
  set username = excluded.username;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
