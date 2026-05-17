import BlogClient from './BlogClient';
import { fetchPublishedBlogs } from '@/lib/actions';

export const revalidate = 0; // Dynamic server component
export const runtime = 'edge';

export default async function BlogPage() {
  const blogs = await fetchPublishedBlogs();

  return <BlogClient initialBlogs={blogs || []} />;
}
