import Link from 'next/link';
import ProgressBar from './ProgressBar';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // ISR: regenerate every hour

export async function generateStaticParams() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug')
    .ilike('status', 'published');
  return blogs?.map((b: { slug: string }) => ({ slug: b.slug })) || [];
}

interface DBBlog {
  id: string;
  title: string;
  slug: string;
  category?: string;
  status?: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  read_time_minutes?: number;
  created_at: string;
  updated_at: string;
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return "March 2026";
  }
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .maybeSingle();

  if (!blog) {
    notFound();
  }

  // Fetch other published blogs for the sidebar dynamic recommendation
  const { data: allBlogs } = await supabase
    .from('blogs')
    .select('*')
    .ilike('status', 'published')
    .order('updated_at', { ascending: false });

  const otherBlogs = (allBlogs || [])
    .filter((b: DBBlog) => b.slug !== resolvedParams.slug)
    .slice(0, 3);

  const formattedDate = formatDate(blog.updated_at || blog.created_at);
  const readTime = blog.read_time_minutes ? `${blog.read_time_minutes} min read` : "5 min read";

  return (
    <>
      <Navigation />

      <ProgressBar />

      <div className="article-header">
        <div className="article-cat">{blog.category || "General"}</div>
        <h1 className="article-title">{blog.title}</h1>
        <p className="article-desc">{blog.excerpt || ""}</p>
        <div className="article-meta">
          <span>{readTime}</span>
          <div className="article-meta-dot"></div>
          <span>{formattedDate}</span>
        </div>
      </div>

      <div className="article-hero-img" style={{ position: 'relative', height: '400px', overflow: 'hidden', borderRadius: '16px', margin: '0 auto', maxWidth: '1000px', marginBottom: '48px' }}>
        <Image 
          src={blog.image_url || "/images/blog/ai_future.png"} 
          alt={blog.title} 
          fill 
          style={{ objectFit: 'cover' }} 
          sizes="(max-width: 1000px) 100vw, 1000px" 
          priority
        />
      </div>

      <div className="article-layout">
        <article className="article-body prose">
          <ReactMarkdown>{blog.content || ""}</ReactMarkdown>
        </article>

        <aside className="article-sidebar">
          {otherBlogs.length > 0 && (
            <div className="sidebar-card">
              <div className="sidebar-card-title">More articles</div>
              <div className="related-mini">
                {otherBlogs.map((other: DBBlog) => (
                  <Link href={`/blog/${other.slug}`} key={other.slug} className="related-mini-item">
                    <div className="related-mini-title">{other.title}</div>
                    <div className="related-mini-meta">
                      {other.read_time_minutes ? `${other.read_time_minutes} min read` : "5 min read"}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-card">
            <div className="sidebar-card-title">Explore related careers</div>
            <div className="related-mini">
              <Link href="/career/IND-1e60d1556d2a" className="related-mini-item">
                <div className="related-mini-title">AI/ML Engineer</div>
                <div className="related-mini-meta">₹12–50 LPA · High demand</div>
              </Link>
              <Link href="/career/IND-4f0c7f88d236" className="related-mini-item">
                <div className="related-mini-title">UX Designer</div>
                <div className="related-mini-meta">₹6–22 LPA · High demand</div>
              </Link>
              <Link href="/career/IND-2fa342702be0" className="related-mini-item">
                <div className="related-mini-title">Cybersecurity Analyst</div>
                <div className="related-mini-meta">₹8–35 LPA · High demand</div>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <Footer />
    </>
  );
}
