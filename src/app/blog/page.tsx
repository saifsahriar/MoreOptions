'use client';
import { useState } from 'react';
import Link from 'next/link';
import MobileNavMenu from '../MobileNavMenu';
import Image from 'next/image';
import { blogs } from '@/lib/blogs';

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Emerging Careers', 'Science', 'Commerce', 'Arts & Design', 'Technology'];

  const filteredBlogs = blogs.filter(b => activeFilter === 'All' || b.category.includes(activeFilter));
  const featuredBlog = activeFilter === 'All' ? blogs.find(b => b.featured) : filteredBlogs[0];
  const gridBlogs = activeFilter === 'All' ? blogs.filter(b => !b.featured) : filteredBlogs.slice(1);

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo">MoreOptions</Link>
        <ul className="nav-links">
          <li><Link href="/careers">Explore Careers</Link></li>
          <li><Link href="/blog" className="active">Insights</Link></li>
          <li><Link href="/saved">Saved</Link></li>
        </ul>
        <div className="nav-actions">
          <Link href="/">
            <button className="nav-cta">Discover yours →</button>
          </Link>
          <MobileNavMenu />
        </div>
      </nav>

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
      </div>

      <footer>
        <div className="footer-logo">MoreOptions</div>
        <div className="footer-links">
          <Link href="#">About</Link><Link href="#">Privacy</Link><Link href="#">Contact</Link>
        </div>
        <div className="footer-copy">© 2026 MoreOptions</div>
      </footer>
    </>
  );
}
