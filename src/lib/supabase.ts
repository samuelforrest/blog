
import { supabase } from '@/integrations/supabase/client';

export { supabase };

// Re-export Database types that we need
export type Blog = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  cover_image: string;
  category: string;
  author: string;
};
