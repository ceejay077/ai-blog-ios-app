-- SEO Article Generator - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  keywords TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  tone TEXT,
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  has_image BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  image_alt_text TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for articles table
CREATE POLICY "Users can view own articles"
  ON public.articles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own articles"
  ON public.articles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own articles"
  ON public.articles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own articles"
  ON public.articles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS articles_user_id_idx ON public.articles(user_id);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON public.articles(created_at DESC);

-- Create storage bucket for article images (Run this in the Storage section of Supabase Dashboard)
-- Or use this SQL to create the bucket:
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for article images
CREATE POLICY "Users can upload own images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'article-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'article-images');

CREATE POLICY "Users can update own images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'article-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'article-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to increment article count
CREATE OR REPLACE FUNCTION public.increment_article_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET article_count = article_count + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to increment article count
DROP TRIGGER IF EXISTS on_article_created ON public.articles;
CREATE TRIGGER on_article_created
  AFTER INSERT ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_article_count();
