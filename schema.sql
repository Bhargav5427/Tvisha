-- Create tables for TVISHA Premium Chaniya Choli Platform

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Categories Table
create table if not exists categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null unique,
    slug text not null unique,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table categories enable row level security;
create policy "Allow public read access to categories" on categories for select using (true);
create policy "Allow admin write access to categories" on categories for all using (true); -- simplified policy for project demo

-- 2. Products Table
create table if not exists products (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text not null unique,
    description text,
    price numeric not null check (price >= 0),
    image_url text not null,
    secondary_image_url text,
    stock integer not null default 0 check (stock >= 0),
    category_id uuid references categories(id) on delete set null,
    fabric text not null,
    embroidery_type text not null,
    sizes text[] not null default '{"S", "M", "L"}'::text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;
create policy "Allow public read access to products" on products for select using (true);
create policy "Allow admin write access to products" on products for all using (true);

-- 3. Orders Table
create table if not exists orders (
    id uuid default uuid_generate_v4() primary key,
    customer_name text not null,
    customer_email text not null,
    customer_phone text,
    shipping_address text not null,
    city text not null,
    postal_code text not null,
    total_amount numeric not null check (total_amount >= 0),
    status text not null default 'Pending' check (status in ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table orders enable row level security;
create policy "Allow public insert access to orders" on orders for insert with check (true);
create policy "Allow admin all access to orders" on orders for all using (true);

-- 4. Order Items Table
create table if not exists order_items (
    id uuid default uuid_generate_v4() primary key,
    order_id uuid references orders(id) on delete cascade not null,
    product_id uuid references products(id) on delete set null,
    quantity integer not null check (quantity > 0),
    size text not null,
    price numeric not null check (price >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table order_items enable row level security;
create policy "Allow public insert access to order_items" on order_items for insert with check (true);
create policy "Allow admin all access to order_items" on order_items for all using (true);

-- 5. Support Tickets Table
create table if not exists support_tickets (
    id uuid default uuid_generate_v4() primary key,
    customer_name text not null,
    customer_email text not null,
    subject text not null,
    message text not null,
    status text not null default 'Open' check (status in ('Open', 'In Progress', 'Resolved', 'Closed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table support_tickets enable row level security;
create policy "Allow public insert access to support_tickets" on support_tickets for insert with check (true);
create policy "Allow admin all access to support_tickets" on support_tickets for all using (true);


-- ====================================================
-- SEED DATA
-- ====================================================

-- Insert Categories
insert into categories (name, slug, description) values
('Heritage Bridal', 'heritage-bridal', 'Intricately handcrafted Chaniya Cholis designed for brides, featuring rich silks, heavy zari work, and traditional motifs.'),
('Festive Glamour', 'festive-glamour', 'Vibrant, high-density flared outfits perfect for Navratri, Diwali, and grand celebrations.'),
('Modern Minimalist', 'modern-minimalist', 'Sleek silhouettes featuring contemporary color-blocking and lightweight fabrics for the modern fashion enthusiast.')
on conflict (name) do nothing;

-- Insert Products
insert into products (title, slug, description, price, image_url, secondary_image_url, stock, category_id, fabric, embroidery_type, sizes) values
(
    'The Rajkumari Crimson Lehenga', 
    'rajkumari-crimson-lehenga', 
    'An exquisite royal crimson lehenga adorned with hand-woven golden zari embroidery, delicate mirror embellishments, and a voluminous 8-meter flare. Tailored to perfection for the heritage bride.',
    1250, 
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', 
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    8, 
    (select id from categories where slug = 'heritage-bridal'), 
    'Raw Silk & Organza Dupatta', 
    'Handcrafted Zardozi & Mirror Work', 
    '{"S", "M", "L", "XL"}'
),
(
    'Mayura Emerald Silk Ensemble', 
    'mayura-emerald-silk', 
    'Inspired by peacock motifs, this deep emerald green silk lehenga features fine resham embroidery, sequin highlights, and a contrast peach banarasi silk dupatta.',
    890, 
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800', 
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    12, 
    (select id from categories where slug = 'heritage-bridal'), 
    'Banarasi Brocade Silk', 
    'Fine Resham & Sequin Embroidery', 
    '{"S", "M", "L"}'
),
(
    'Vasant Kora Festive Set', 
    'vasant-kora-festive', 
    'Celebrate spring with this pastel yellow georgette Chaniya Choli, adorned with delicate thread work, sequin highlights, and a mirror-work border. Highly breathable and perfect for dancing Navratri nights.',
    450, 
    'https://images.unsplash.com/photo-1610030470216-c73ab6a086ea?auto=format&fit=crop&q=80&w=800', 
    null,
    15, 
    (select id from categories where slug = 'festive-glamour'), 
    'Georgette & Chiffon', 
    'Delicate Threadwork & Mirror Borders', 
    '{"XS", "S", "M", "L"}'
),
(
    'Navratri Aari Fusion Lehenga', 
    'navratri-aari-fusion', 
    'Traditional Gujarati Aari embroidery meets modern design. Featuring multi-colored panels, traditional kutchi motifs, and an adjustable drawstring waist for maximum movement.',
    320, 
    'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800', 
    null,
    20, 
    (select id from categories where slug = 'festive-glamour'), 
    'Khadi Cotton', 
    'Kutchi Aari & Applique Work', 
    '{"S", "M", "L", "XL"}'
),
(
    'Noor Ivory Minimalist Lehenga', 
    'noor-ivory-minimalist', 
    'Understated elegance in ivory silk. Features modern block print patterns, a slim borders, and a minimal lightweight net dupatta with gold tassels.',
    550, 
    'https://images.unsplash.com/photo-1610030470251-512c0199581c?auto=format&fit=crop&q=80&w=800', 
    null,
    6, 
    (select id from categories where slug = 'modern-minimalist'), 
    'Chanderi Silk', 
    'Gold Block Printing & Zari Edging', 
    '{"S", "M", "L"}'
)
on conflict (slug) do nothing;
