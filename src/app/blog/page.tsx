import BlogClient from './BlogClient';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // ISR: regenerate every hour

export default async function BlogPage() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .ilike('status', 'published')
    .order('updated_at', { ascending: false });

  return <BlogClient initialBlogs={blogs || []} />;
}
