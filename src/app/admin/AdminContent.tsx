'use client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export interface CareerObj {
  career_id: string;
  career_name: string;
  industry: string;
  stream?: string;
  salary_range_india?: string;
  demand_trend?: string;
  description?: string;
}

interface AdminContentProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  careers: CareerObj[];
  filteredCareers: CareerObj[];
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
  searchQuery,
  setSearchQuery,
  handleLogout,
  handleDelete,
  setShowAddModal,
  setShowBlogModal,
  getDemandClass
}: AdminContentProps) {
  return (
    <div className="admin-shell">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">MoreOptions <span>Admin CMS</span></div>
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Overview</div>
          <button className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <span className="sidebar-nav-icon">◈</span> Dashboard
          </button>

          <div className="sidebar-section-label">Content</div>
          <button className={`sidebar-nav-item ${activeTab === 'careers' ? 'active' : ''}`} onClick={() => setActiveTab('careers')}>
            <span className="sidebar-nav-icon">⬡</span> Careers
            <span className="sidebar-badge">{careers.length}</span>
          </button>
          <button className={`sidebar-nav-item ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>
            <span className="sidebar-nav-icon">✦</span> Blog Posts
            <span className="sidebar-badge">0</span>
          </button>

          <div className="sidebar-section-label">System</div>
          <button className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <span className="sidebar-nav-icon">◯</span> Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.email?.[0].toUpperCase()}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name" style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
              <div className="sidebar-user-role">Super admin</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost btn-sm" style={{ padding: '0 8px', width: '100%', marginTop: '8px' }}>Log out</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div className="topbar-title">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'careers' && 'Careers'}
            {activeTab === 'blog' && 'Blog Posts'}
            {activeTab === 'settings' && 'Settings'}
          </div>
          <div className="topbar-actions">
            <Link href="/" target="_blank">
              <button className="btn btn-ghost">View site ↗</button>
            </Link>
            {activeTab !== 'settings' && (
              <button className="btn btn-primary" onClick={() => activeTab === 'blog' ? setShowBlogModal(true) : setShowAddModal(true)}>
                {activeTab === 'blog' ? '+ New article' : '+ Add career'}
              </button>
            )}
          </div>
        </div>

        <div className="admin-content">
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-card-label">Total careers</div>
                  <div className="stat-card-value">{careers.length}</div>
                  <div className="stat-card-delta delta-up">Live Database</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Blog posts</div>
                  <div className="stat-card-value">0</div>
                  <div className="stat-card-delta delta-up">To be implemented</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Monthly visitors</div>
                  <div className="stat-card-value">--</div>
                  <div className="stat-card-delta delta-up">Pending Analytics Integration</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Avg. session time</div>
                  <div className="stat-card-value">--</div>
                  <div className="stat-card-delta delta-up">Pending Analytics Integration</div>
                </div>
              </div>

              <div className="table-card">
                <div className="table-header">
                  <div className="table-header-left">
                    <div className="table-title">Recently added careers</div>
                    <div className="table-sub">Last 5 entries</div>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr><th>ID</th><th>Career name</th><th>Category</th><th>Salary</th><th>Demand</th></tr>
                  </thead>
                  <tbody>
                    {careers.slice(0, 5).map(c => (
                      <tr key={c.career_id}>
                        <td style={{ color: 'var(--text3)' }}>#{c.career_id}</td>
                        <td className="td-name">{c.career_name}</td>
                        <td><span className="td-cat">{c.industry}</span></td>
                        <td>{c.salary_range_india || 'N/A'}</td>
                        <td><span className={`td-demand ${getDemandClass(c.demand_trend)}`}>{c.demand_trend || 'Unknown'}</span></td>
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
                    <div className="table-sub">{careers.length} total entries</div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div className="table-search">
                      <span style={{ color: 'var(--text3)', fontSize: '14px' }}>⌕</span>
                      <input type="text" placeholder="Search careers…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add career</button>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr><th>ID</th><th>Career name</th><th>Category</th><th>Stream</th><th>Salary</th><th>Demand</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredCareers.map(c => (
                      <tr key={c.career_id}>
                        <td style={{ color: 'var(--text3)' }}>#{c.career_id}</td>
                        <td className="td-name">{c.career_name}</td>
                        <td><span className="td-cat">{c.industry}</span></td>
                        <td>{c.stream}</td>
                        <td>{c.salary_range_india || 'N/A'}</td>
                        <td><span className={`td-demand ${getDemandClass(c.demand_trend)}`}>{c.demand_trend}</span></td>
                        <td className="td-actions">
                          <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(true, c)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.career_id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)' }}>Blog posts</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>24 articles published</div>
                </div>
                <button className="btn btn-primary" onClick={() => setShowBlogModal(true)}>+ New article</button>
              </div>
              <div className="blog-grid-admin">
                <div className="blog-admin-card">
                  <div className="blog-admin-img">AI</div>
                  <div className="blog-admin-title">Why AI won&apos;t replace these 12 careers — it will create them</div>
                  <div className="blog-admin-meta">Published · 12 min read · March 2026</div>
                  <div className="blog-admin-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowBlogModal(true)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => {}}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <div className="table-card" style={{ padding: '28px', maxWidth: '560px' }}>
                <div className="table-title" style={{ marginBottom: '20px' }}>Site settings</div>
                <div className="form-row"><label>Site name</label><input type="text" defaultValue="MoreOptions" /></div>
                <div className="form-row"><label>Admin email</label><input type="text" defaultValue="admin@moreoptions.in" /></div>
                <div className="form-row"><label>Supabase project URL</label><input type="text" placeholder="https://xxxx.supabase.co" /></div>
                <div className="form-row"><label>Careers per page</label><input type="number" defaultValue="24" /></div>
                <div style={{ marginTop: '8px' }}><button className="btn btn-primary" onClick={() => {}}>Save changes</button></div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
