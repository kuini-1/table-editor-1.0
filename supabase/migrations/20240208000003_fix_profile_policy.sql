-- Add insert policy for profiles
create policy "Users can insert own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

-- Enable realtime for relevant tables
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.owners;
alter publication supabase_realtime add table public.tables; 