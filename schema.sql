-- ==============================================================================
-- EBOOK & DIGITAL PRODUCTS PLATFORM SCHEMA
-- Dedicated Independent Database for AI Vault & Ebook Landing Platform
-- DO NOT MIX WITH AMCAL ROSTER APPLICATION (gcslfkujlfnznedatrsn)
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.ebook_products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL DEFAULT 999,
    category TEXT NOT NULL DEFAULT 'AI Business',
    rating NUMERIC(2,1) DEFAULT 4.9,
    reviews INTEGER DEFAULT 120,
    cover_url TEXT,
    download_url TEXT,
    stripe_price_id TEXT,
    stripe_payment_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Purchases & Orders Table
CREATE TABLE IF NOT EXISTS public.ebook_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent TEXT,
    customer_email TEXT NOT NULL,
    product_id TEXT REFERENCES public.ebook_products(id) ON DELETE SET NULL,
    amount_total_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'completed',
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE public.ebook_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_orders ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Anyone can view published products
CREATE POLICY "Public Read Published Ebook Products"
    ON public.ebook_products FOR SELECT
    USING (is_published = true);

-- Service role full access for factory & sync scripts
CREATE POLICY "Service Role Full Access Ebook Products"
    ON public.ebook_products FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service Role Full Access Ebook Orders"
    ON public.ebook_orders FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- 6. Storage Bucket setup for Ebooks (Run in SQL Editor if creating new Supabase instance)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('ebook-vault', 'ebook-vault', true) ON CONFLICT DO NOTHING;
