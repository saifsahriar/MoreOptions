import { createClient } from '@/lib/supabase-server';
import AdminClientWrapper from './AdminClientWrapper';
import LoginForm from './LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | MoreOptions',
  robots: {
    index: false,
    follow: false
  }
};

export const runtime = 'edge';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Check RBAC claim for admin role
  const isAdmin = user?.app_metadata?.role === 'admin';

  if (!user || !isAdmin) {
    return <LoginForm />;
  }

  // Fetch initial careers data
  const { data: careers } = await supabase
    .from('careers')
    .select('*')
    .order('career_name', { ascending: true });

  // Fetch initial blogs data
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('updated_at', { ascending: false });

  return (
    <AdminClientWrapper 
      user={user} 
      initialCareers={careers || []} 
      initialBlogs={blogs || []}
    />
  );
}
