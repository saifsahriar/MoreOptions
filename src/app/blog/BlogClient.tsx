'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

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

interface BlogClientProps {
  initialBlogs: DBBlog[];
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

export default function BlogClient({ initialBlogs }: BlogClientProps) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Emerging Careers', 'Science', 'Commerce', 'Arts & Design', 'Technology'];

  // Map database blogs to match UI expectations
  const mappedBlogs = initialBlogs.map((dbBlog, idx) => ({
    slug: dbBlog.slug,
    title: dbBlog.title,
    category: dbBlog.category || "General",
    image: dbBlog.image_url || "/images/blog/ai_future.png",
    desc: dbBlog.excerpt || "",
    time: dbBlog.read_time_minutes ? `${dbBlog.read_time_minutes} min read` : "5 min read",
    date: formatDate(dbBlog.updated_at || dbBlog.created_at),
    // Treat the designated slug or simply the first item as featured
    featured: dbBlog.slug === 'why-ai-wont-replace-careers' || (idx === 0 && initialBlogs.length > 0)
  }));

  const filteredBlogs = mappedBlogs.filter(b => activeFilter === 'All' || b.category.toLowerCase().includes(activeFilter.toLowerCase()));
  const featuredBlog = activeFilter === 'All' ? mappedBlogs.find(b => b.featured) : filteredBlogs[0];
  const gridBlogs = activeFilter === 'All' ? mappedBlogs.filter(b => !b.featured) : filteredBlogs.slice(1);

  return (
    <>
      <Navigation />

      <div className="page-header">
        <div>
          <div className="page-eyebrow">The MoreOptions Blog</div>
          <h1 className="page-title">Insights worth<br/>your time</h1>
          <p className="page-sub">Deep dives into careers, industries, and the futures that are actually available to you.</p>
        </div>
        <div className="filter-pills">
          {filters.map(f => (
            <button 
              key={f}
              className={`pill ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED */}
      {featuredBlog && (
        <div className="featured-section">
          <Link href={`/blog/${featuredBlog.slug}`} className="featured-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="featured-img" style={{ position: 'relative', overflow: 'hidden' }}>
              <Image src={featuredBlog.image} alt={featuredBlog.title} fill style={{ objectFit: 'cover' }} />
              <div className="featured-img-badge" style={{ position: 'relative', zIndex: 10 }}>Featured</div>
            </div>
            <div className="featured-body">
              <div>
                <div className="featured-cat">{featuredBlog.category}</div>
                <div className="featured-title">{featuredBlog.title}</div>
                <div className="featured-desc">{featuredBlog.desc}</div>
              </div>
              <div className="featured-meta">
                <span className="featured-meta-text">{featuredBlog.time}</span>
                <span className="featured-meta-text">·</span>
                <span className="featured-meta-text">{featuredBlog.date}</span>
                <button className="featured-read-btn">Read article →</button>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ARTICLES */}
      <div className="blog-section">
        <div className="blog-section-header">
          <div className="blog-section-title">All articles</div>
        </div>
        
        {mappedBlogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--text3)' }}>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>No articles published yet.</p>
            <p style={{ fontSize: '14px' }}>Check back soon for latest insights!</p>
          </div>
        ) : (
          <div className="blog-grid">
            {gridBlogs.map((blog) => (
              <Link href={`/blog/${blog.slug}`} key={blog.slug} className="blog-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="blog-img" style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image src={blog.image} alt={blog.title} fill style={{ objectFit: 'cover' }} />
                  <div className="blog-img-cat" style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 10, background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: 4, color: '#000', fontSize: '12px', fontWeight: 600 }}>{blog.category}</div>
                </div>
                <div className="blog-body">
                  <div className="blog-title">{blog.title}</div>
                  <div className="blog-desc">{blog.desc}</div>
                  <div className="blog-meta">{blog.time} · {blog.date}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
