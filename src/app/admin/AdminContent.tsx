'use client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export interface CareerObj {
  career_id: string;
  career_name: string;
  industry: string;
  stream?: string;
  salary_range_india?: string;
  demand_trend?: string;
  description?: string;
}

export interface BlogObj {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  excerpt: string;
  image_url: string;
  read_time_minutes: number;
  created_at: string;
}

interface AdminContentProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  careers: CareerObj[];
  filteredCareers: CareerObj[];
  blogs: BlogObj[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleLogout: () => void;
  handleDelete: (id: string | number) => void;
  setShowAddModal: (show: boolean, career?: CareerObj) => void;
  setShowBlogModal: (show: boolean) => void;
  getDemandClass: (d?: string) => string;
}

export default function AdminContent({
  user,
  activeTab,
  setActiveTab,
  careers,
  filteredCareers,
  blogs,
  searchQuery,
  setSearchQuery,
  handleLogout,
  handleDelete,
  setShowAddModal,
  setShowBlogModal,
  getDemandClass
}: AdminContentProps) {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  const totalPages = Math.ceil(filteredCareers.length / PAGE_SIZE);
  const paginatedCareers = filteredCareers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Task 18: Session Idle Timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 15 minutes timeout
      timeoutId = setTimeout(() => {
        handleLogout();
      }, 15 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(name => document.addEventListener(name, resetTimer, true));

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(name => document.removeEventListener(name, resetTimer, true));
    };
  }, [handleLogout]);



  return (
    <div className="admin-shell">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">MoreOptions <span>Admin CMS</span></div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Overview</div>
          <button className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span className="sidebar-nav-icon">⊞</span> Dashboard
          </button>

          <div className="sidebar-section-label">Content</div>
          <button className={`sidebar-nav-item ${activeTab === 'careers' ? 'active' : ''}`} onClick={() => { setActiveTab('careers'); setPage(1); }}>
            <span className="sidebar-nav-icon">☰</span> Careers database
          </button>
          <button className={`sidebar-nav-item ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>
            <span className="sidebar-nav-icon">✎</span> Blog & Articles
          </button>

          <div className="sidebar-section-label">System</div>
          <button className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <span className="sidebar-nav-icon">⚙</span> Settings
          </button>
          <button className="sidebar-nav-item" onClick={handleLogout} style={{ marginTop: 'auto', color: 'var(--danger)' }}>
            <span className="sidebar-nav-icon">⎋</span> Sign out
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-breadcrumb">
            Dashboard / <span style={{ color: 'var(--text)' }}>{activeTab === 'careers' ? 'Careers Database' : activeTab === 'blog' ? 'Blog' : activeTab === 'settings' ? 'Settings' : 'Overview'}</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/" target="_blank" className="btn btn-ghost btn-sm">View live site ↗</Link>
            <div className="topbar-user">
              <div className="user-avatar">{user?.email?.charAt(0).toUpperCase() || 'A'}</div>
              <div className="user-email">{user?.email || 'admin@moreoptions.in'}</div>
            </div>
          </div>
        </div>

        <div className="admin-content-inner">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 400, letterSpacing: '-0.8px', marginBottom: '8px' }}>Welcome back</div>
              <div style={{ color: 'var(--text2)', marginBottom: '40px' }}>Here&apos;s what&apos;s happening across the platform today.</div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-title">Total Careers</div>
                  <div className="stat-card-val">{careers.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-title">Published Articles</div>
                  <div className="stat-card-val">24</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-title">Database Status</div>
                  <div className="stat-card-val" style={{ color: 'var(--success)' }}>Connected</div>
                </div>
              </div>

              <div className="table-card">
                <div className="table-header">
                  <div className="table-title">Recently added careers</div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('careers')}>View all</button>
                </div>
                <table>
                  <thead>
                    <tr><th>ID</th><th>Career name</th><th>Category</th><th>Added on</th></tr>
                  </thead>
                  <tbody>
                    {careers.slice(0, 5).map(c => (
                      <tr key={c.career_id}>
                        <td style={{ color: 'var(--text3)' }}>#{c.career_id.slice(0, 8)}</td>
                        <td className="td-name">{c.career_name}</td>
                        <td><span className="td-cat">{c.industry}</span></td>
                        <td>Today</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CAREERS TAB */}
          {activeTab === 'careers' && (
            <div>
              <div className="table-card">
                <div className="table-header">
                  <div className="table-header-left">
                    <div className="table-title">All careers</div>
                    <div className="table-sub">{filteredCareers.length} total entries</div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div className="table-search">
                      <span style={{ color: 'var(--text3)', fontSize: '16px' }}>⌕</span>
                      <input type="text" placeholder="Search careers…" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} />
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add career</button>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr><th>ID</th><th>Career name</th><th>Category</th><th>Stream</th><th>Salary</th><th>Demand</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {paginatedCareers.map(c => (
                      <tr key={c.career_id}>
                        <td style={{ color: 'var(--text3)' }}>#{c.career_id.slice(0, 8)}</td>
                        <td className="td-name">{c.career_name}</td>
                        <td><span className="td-cat">{c.industry}</span></td>
                        <td>{c.stream}</td>
                        <td style={{ fontSize: '13px' }}>{c.salary_range_india || 'N/A'}</td>
                        <td><span className={`td-demand ${getDemandClass(c.demand_trend)}`}>{c.demand_trend}</span></td>
                        <td className="td-actions">
                          <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(true, c)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.career_id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '24px', borderTop: '1px solid var(--border)', background: 'var(--bg3)' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={page === 1}
                      style={{ opacity: page === 1 ? 0.5 : 1 }}
                    >
                      ← Previous
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text2)' }}>Page {page} of {totalPages}</span>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={page === totalPages}
                      style={{ opacity: page === totalPages ? 0.5 : 1 }}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '28px', color: 'var(--text)' }}>Blog posts</div>
                  <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px' }}>{blogs.length} articles published</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowBlogModal(true)}>+ New article</button>
              </div>
              <div className="blog-grid-admin">
                {blogs.map(blog => (
                  <div className="blog-admin-card" key={blog.id}>
                    <div className="blog-admin-img" style={{ backgroundImage: `url(${blog.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' }}>IMG</div>
                    <div className="blog-admin-title">{blog.title}</div>
                    <div className="blog-admin-meta">{blog.status === 'published' ? 'Published' : 'Draft'} · {blog.read_time_minutes} min read · {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                    <div className="blog-admin-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setShowBlogModal(true)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => { }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <div className="table-card" style={{ padding: '32px', maxWidth: '600px' }}>
                <div className="table-title" style={{ fontSize: '20px', marginBottom: '24px' }}>Site settings</div>
                <div className="form-row"><label>Site name</label><input type="text" defaultValue="MoreOptions" /></div>
                <div className="form-row"><label>Admin email</label><input type="text" defaultValue="admin@moreoptions.in" /></div>
                <div className="form-row"><label>Supabase project URL</label><input type="text" placeholder="https://xxxx.supabase.co" /></div>
                <div className="form-row"><label>Careers per page</label><input type="number" defaultValue="24" /></div>
                <div style={{ marginTop: '12px' }}><button className="btn btn-primary" onClick={() => { }}>Save changes</button></div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );

}
