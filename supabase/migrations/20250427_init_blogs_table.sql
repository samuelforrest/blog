
-- Create the blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL
);

-- Allow public read access (since blog posts are public)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.blogs FOR SELECT USING (true);

-- Allow admin operations with password-based authentication
-- This will be handled through our app's password protection mechanism
CREATE POLICY "Allow admin write access" ON public.blogs FOR ALL USING (true) WITH CHECK (true);
