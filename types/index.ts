export type Region = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  visited: boolean;
  order_index: number;
};

export type Comuna = {
  id: string;
  region_id: string;
  name: string;
  slug: string;
  visited: boolean;
  visit_date: string | null;
  coordinates: { x: number; y: number } | null; // Point in Supabase
  post_id: string | null;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any; // JSONB structure
  cover_image: string | null;
  region_id: string | null;
  comuna_id: string | null;
  travel_date: string | null;
  published: boolean;
  created_at: string;
};

export type Photo = {
  id: string;
  post_id: string | null;
  url: string;
  caption: string | null;
  is_featured: boolean;
  order_index: number;
  created_at: string;
};

export type Subscriber = {
  id: string;
  email: string;
  active: boolean;
  subscribed_at: string;
};

export type ProjectStats = {
  comunas_visited: number;
  total_comunas: number;
  regions_visited: number;
  total_regions: number;
  kilometers: number;
  days_in_route: number;
};
