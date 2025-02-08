-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    company_name text,
    role text check (role in ('owner', 'sub_owner')) not null default 'owner',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create owners table
create table public.owners (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamptz default now()
);

-- Create sub_owners table
create table public.sub_owners (
    id uuid primary key default uuid_generate_v4(),
    profile_id uuid references public.profiles(id) on delete cascade not null,
    owner_id uuid references public.owners(id) on delete cascade not null,
    created_at timestamptz default now()
);

-- Create tables table to store metadata about different table types
create table public.tables (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    type text check (type in ('exp', 'merchant', 'item')) not null,
    owner_id uuid references public.owners(id) on delete cascade not null,
    created_at timestamptz default now(),
    unique(owner_id, type)
);

-- Create table data tables
create table public.exp_data (
    id uuid primary key default uuid_generate_v4(),
    table_id uuid references public.tables(id) on delete cascade not null,
    data jsonb not null default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.merchant_data (
    id uuid primary key default uuid_generate_v4(),
    table_id uuid references public.tables(id) on delete cascade not null,
    data jsonb not null default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.item_data (
    id uuid primary key default uuid_generate_v4(),
    table_id uuid references public.tables(id) on delete cascade not null,
    data jsonb not null default '{}',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create permissions table
create table public.sub_owner_permissions (
    id uuid primary key default uuid_generate_v4(),
    sub_owner_id uuid references public.sub_owners(id) on delete cascade not null,
    table_id uuid references public.tables(id) on delete cascade not null,
    can_get boolean default false,
    can_put boolean default false,
    can_post boolean default false,
    can_delete boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(sub_owner_id, table_id)
);

-- Create activity logs table
create table public.activity_logs (
    id uuid primary key default uuid_generate_v4(),
    table_id uuid references public.tables(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    action text check (action in ('create', 'update', 'delete')) not null,
    details text not null,
    created_at timestamptz default now()
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.owners enable row level security;
alter table public.sub_owners enable row level security;
alter table public.tables enable row level security;
alter table public.exp_data enable row level security;
alter table public.merchant_data enable row level security;
alter table public.item_data enable row level security;
alter table public.sub_owner_permissions enable row level security;
alter table public.activity_logs enable row level security;

-- Create policies
-- Profiles: users can read their own profile
create policy "Users can read own profile"
    on public.profiles for select
    using (auth.uid() = id);

-- Profiles: users can update their own profile
create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);

-- Profiles: users can insert their own profile
create policy "Users can insert own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

-- Owners: owners can read their own record
create policy "Owners can read own record"
    on public.owners for select
    using (profile_id = auth.uid());

-- Sub_owners: owners can read their sub_owners
create policy "Owners can read their sub_owners"
    on public.sub_owners for select
    using (owner_id in (select id from public.owners where profile_id = auth.uid()));

-- Tables: owners can read their own tables
create policy "Owners can read own tables"
    on public.tables for select
    using (owner_id in (select id from public.owners where profile_id = auth.uid()));

-- Tables: sub_owners can read tables they have permissions for
create policy "Sub_owners can read permitted tables"
    on public.tables for select
    using (id in (
        select table_id from public.sub_owner_permissions
        where sub_owner_id in (
            select id from public.sub_owners
            where profile_id = auth.uid()
        )
        and can_get = true
    ));

-- Create functions for managing permissions
create or replace function public.check_table_permission(
    p_table_id uuid,
    p_action text
)
returns boolean
language plpgsql
security definer
as $$
begin
    -- Check if user is the owner
    if exists (
        select 1 from public.tables t
        join public.owners o on t.owner_id = o.id
        where t.id = p_table_id
        and o.profile_id = auth.uid()
    ) then
        return true;
    end if;

    -- Check if user is a sub_owner with appropriate permission
    return exists (
        select 1 from public.sub_owner_permissions p
        join public.sub_owners so on p.sub_owner_id = so.id
        where p.table_id = p_table_id
        and so.profile_id = auth.uid()
        and case p_action
            when 'select' then p.can_get
            when 'update' then p.can_put
            when 'insert' then p.can_post
            when 'delete' then p.can_delete
            else false
        end
    );
end;
$$; 