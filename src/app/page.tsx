import HomeClient from './HomeClient';
import { fetchPublishedBlogs } from '@/lib/actions';

export const revalidate = 0; // Dynamic server component
export const runtime = 'edge';

export default async function LandingPage() {
  const blogs = await fetchPublishedBlogs();

  return <HomeClient initialBlogs={blogs || []} />;
}
