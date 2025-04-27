
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rzghaxmownnryqydpswz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6Z2hheG1vd25ucnlxeWRwc3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NTQ3NTIsImV4cCI6MjA2MTMzMDc1Mn0.D15A85mMPQBxHkcHOxcRZ6YLbiJ4P_a8qwBW305DUwI";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
