'use client';
import { useState } from 'react';
import Link from 'next/link';
import MobileNavMenu from '../MobileNavMenu';
import Image from 'next/image';

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Emerging Careers', 'Science', 'Commerce', 'Arts & Design', 'Technology'];

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo">MoreOptions</Link>
        <ul className="nav-links">
          <li><Link href="/careers">Explore Careers</Link></li>
          <li><Link href="/blog" className="active">Insights</Link></li>
          <li><Link href="#">For Counselors</Link></li>
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
      <div className="featured-section">
        <Link href="/blog/why-ai-wont-replace-careers" className="featured-card">
          <div className="featured-img" style={{ position: 'relative', overflow: 'hidden' }}>
            <Image src="/images/blog/ai_future.png" alt="AI Careers" fill style={{ objectFit: 'cover' }} />
            <div className="featured-img-badge" style={{ position: 'relative', zIndex: 10 }}>Featured</div>
          </div>
          <div className="featured-body">
            <div>
              <div className="featured-cat">Emerging Careers · Technology</div>
              <div className="featured-title">Why AI won&apos;t replace these 12 careers — it will create them</div>
              <div className="featured-desc">The conversation around AI and jobs is mostly fear. Here&apos;s the part nobody talks about: the entirely new professions that are emerging because of AI, and how Indian students can position themselves now.</div>
            </div>
            <div className="featured-meta">
              <span className="featured-meta-text">12 min read</span>
              <span className="featured-meta-text">·</span>
              <span className="featured-meta-text">March 2026</span>
              <button className="featured-read-btn">Read article →</button>
            </div>
          </div>
        </Link>
      </div>

      {/* ARTICLES */}
      <div className="blog-section">
        <div className="blog-section-header">
          <div className="blog-section-title">All articles</div>
        </div>
        <div className="blog-grid">
          <Link href="/blog/beyond-ca" className="blog-card">
            <div className="blog-img">
              <Image src="/images/blog/commerce.png" alt="Commerce" fill style={{ objectFit: 'cover' }} />
              <div className="blog-img-cat" style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 10, background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: 4 }}>Commerce</div>
            </div>
            <div className="blog-body">
              <div className="blog-title">Beyond CA: 20 commerce careers most counselors won&apos;t tell you about</div>
              <div className="blog-desc">From actuarial science to forensic accounting — the high-paying commerce paths that stay hidden.</div>
              <div className="blog-meta">6 min read · February 2026</div>
            </div>
          </Link>

          <Link href="/blog/post" className="blog-card">
            <div className="blog-img">
              <Image src="/images/blog/science.png" alt="Science" fill style={{ objectFit: 'cover' }} />
              <div className="blog-img-cat" style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 10, background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: 4 }}>Science</div>
            </div>
            <div className="blog-body">
              <div className="blog-title">The science careers that will matter most in India by 2035</div>
              <div className="blog-desc">Climate science, synthetic biology, and neurotechnology are rewriting what a science degree can unlock.</div>
              <div className="blog-meta">10 min read · January 2026</div>
            </div>
          </Link>

          <Link href="/blog/post" className="blog-card">
            <div className="blog-img">
              <div className="blog-img-glyph">✦</div>
              <div className="blog-img-cat">Arts & Design</div>
            </div>
            <div className="blog-body">
              <div className="blog-title">The arts student&apos;s guide to earning ₹20 LPA without switching fields</div>
              <div className="blog-desc">Design thinking, UX, and content strategy are proving that arts degrees are undervalued — not underpaying.</div>
              <div className="blog-meta">8 min read · December 2025</div>
            </div>
          </Link>

          <Link href="/blog/post" className="blog-card">
            <div className="blog-img">
              <div className="blog-img-glyph">◈</div>
              <div className="blog-img-cat">Emerging Careers</div>
            </div>
            <div className="blog-body">
              <div className="blog-title">What is a Prompt Engineer and why Indian startups are hiring them now</div>
              <div className="blog-desc">A new role with no degree requirement, high demand, and salaries that rival software engineering.</div>
              <div className="blog-meta">5 min read · November 2025</div>
            </div>
          </Link>

          <Link href="/blog/post" className="blog-card">
            <div className="blog-img">
              <Image src="/images/blog/cybersecurity.png" alt="Technology" fill style={{ objectFit: 'cover' }} />
              <div className="blog-img-cat" style={{ position: 'absolute', bottom: 8, left: 8, zIndex: 10, background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: 4 }}>Technology</div>
            </div>
            <div className="blog-body">
              <div className="blog-title">Cybersecurity in India: the most underpopulated high-paying field</div>
              <div className="blog-desc">Thousands of open roles, shortage of candidates, and starting salaries above ₹8 LPA. Here&apos;s the full picture.</div>
              <div className="blog-meta">7 min read · October 2025</div>
            </div>
          </Link>

          <Link href="/blog/post" className="blog-card">
            <div className="blog-img">
              <div className="blog-img-glyph">∞</div>
              <div className="blog-img-cat">Science</div>
            </div>
            <div className="blog-body">
              <div className="blog-title">Marine Biology in India: is it actually viable as a career?</div>
              <div className="blog-desc">The honest, detailed answer — institutions, salaries, research opportunities, and what nobody tells you.</div>
              <div className="blog-meta">9 min read · September 2025</div>
            </div>
          </Link>
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
