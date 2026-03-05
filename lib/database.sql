-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Regions Table
create table regions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  visited boolean default false,
  order_index int,
  created_at timestamp with time zone default now()
);

-- Communes Table
create table comunas (
  id uuid primary key default uuid_generate_v4(),
  region_id uuid references regions(id) on delete cascade,
  name text not null,
  slug text unique not null,
  visited boolean default false,
  visit_date timestamp with time zone,
  coordinates point,
  cover_image text,
  post_id uuid, -- Will be linked later
  created_at timestamp with time zone default now()
);

-- Posts Table
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content jsonb,
  cover_image text,
  region_id uuid references regions(id),
  comuna_id uuid references comunas(id),
  travel_date date,
  published boolean default false,
  created_at timestamp with time zone default now()
);

-- Photos Table
create table photos (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade,
  url text not null,
  caption text,
  is_featured boolean default false,
  order_index int,
  created_at timestamp with time zone default now()
);

-- Subscribers Table
create table subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  active boolean default true,
  subscribed_at timestamp with time zone default now()
);

-- RLS (Row Level Security) - Initial Setup
alter table regions enable row level security;
alter table comunas enable row level security;
alter table posts enable row level security;
alter table photos enable row level security;
alter table subscribers enable row level security;

-- Public read access for most tables
create policy "Public can read regions" on regions for select using (true);
create policy "Public can read comunas" on comunas for select using (true);
create policy "Public can read published posts" on posts for select using (published = true);
create policy "Public can read photos" on photos for select using (true);

-- Anonymous insert for subscribers
create policy "Anyone can subscribe" on subscribers for insert with check (true);
