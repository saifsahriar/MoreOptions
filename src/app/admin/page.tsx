'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

const CAREERS_DATA = [
  { name:'AI/ML Engineer', cat:'Technology', stream:'Any', salary:'₹12–50 LPA', demand:'high' },
  { name:'UX Designer', cat:'Creative', stream:'Any', salary:'₹6–22 LPA', demand:'high' },
  { name:'Marine Biologist', cat:'Science', stream:'Science', salary:'₹4–18 LPA', demand:'growing' },
  { name:'Investment Banker', cat:'Commerce', stream:'Commerce', salary:'₹15–80 LPA', demand:'high' },
  { name:'Game Designer', cat:'Creative', stream:'Any', salary:'₹5–25 LPA', demand:'high' },
  { name:'Cybersecurity Analyst', cat:'Technology', stream:'Any', salary:'₹8–35 LPA', demand:'high' },
  { name:'Environmental Scientist', cat:'Science', stream:'Science', salary:'₹4–16 LPA', demand:'growing' },
  { name:'Forensic Accountant', cat:'Commerce', stream:'Commerce', salary:'₹8–30 LPA', demand:'growing' },
  { name:'Organizational Psychologist', cat:'People', stream:'Arts', salary:'₹6–20 LPA', demand:'growing' },
  { name:'Aviation Pilot', cat:'Technology', stream:'Science', salary:'₹8–40 LPA', demand:'high' },
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // Kept original default tab
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [careers, setCareers] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
        fetchCareers();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
        fetchCareers();
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setCareers([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase.from('careers').select('*').order('career_id', { ascending: false });
      if (error) {
        // Securely log internally, do not leak DB details
        console.warn('Backend fetch policy restriction or network error');
        return;
      }
      if (data) setCareers(data);
    } catch {
      console.warn('Failed to fetch resource securely');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  const filteredCareers = careers.filter(c => 
    (c.career_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (c.industry || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDemandClass = (d: string) => {
    const val = (d || '').toLowerCase();
    if (val === 'high') return 'd-high';
    if (val === 'growing') return 'd-mid';
    return 'd-new';
  };

  if (!isAuthenticated) {
    return (
      <div className="login-overlay">
        <div className="login-box">
          <div className="login-logo">MoreOptions</div>
          <div className="login-sub">Admin dashboard — restricted access</div>
          <form onSubmit={handleLogin}>
            <label className="login-label">Email</label>
            <input className="login-input" type="text" placeholder="admin@moreoptions.in" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <label className="login-label">Password</label>
            <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="login-btn" type="submit">Sign in →</button>
          </form>
          {authError && <div style={{ color: 'var(--red)', marginTop: '12px', fontSize: '14px', textAlign: 'center' }}>{authError}</div>}
          <div className="login-note">Only authorized admins may log in</div>
        </div>
      </div>
    );
  }

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
                          <button className="btn btn-ghost btn-sm" onClick={() => setShowAddModal(true)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => showToast('Career deleted')}>Delete</button>
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
                    <button className="btn btn-danger btn-sm" onClick={() => showToast('Post deleted')}>Delete</button>
                  </div>
                </div>
                <div className="blog-admin-card">
                  <div className="blog-admin-img">₹</div>
                  <div className="blog-admin-title">Beyond CA: 20 commerce careers most counselors won&apos;t tell you about</div>
                  <div className="blog-admin-meta">Published · 6 min read · February 2026</div>
                  <div className="blog-admin-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowBlogModal(true)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => showToast('Post deleted')}>Delete</button>
                  </div>
                </div>
                <div className="blog-admin-card">
                  <div className="blog-admin-img">✦</div>
                  <div className="blog-admin-title">The arts student&apos;s guide to earning ₹20 LPA without switching fields</div>
                  <div className="blog-admin-meta">Draft · 8 min read</div>
                  <div className="blog-admin-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowBlogModal(true)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => showToast('Post deleted')}>Delete</button>
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
                <div style={{ marginTop: '8px' }}><button className="btn btn-primary" onClick={() => showToast('Settings saved')}>Save changes</button></div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODALS */}
      {showAddModal && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-head-title">Add new career</div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row"><label>Career name</label><input type="text" placeholder="e.g. Marine Biologist" /></div>
              <div className="form-row-2">
                <div><label>Category</label>
                  <select>
                    <option>Technology</option><option>Creative</option><option>Science</option>
                    <option>Commerce</option><option>People & Society</option><option>Nature</option>
                  </select>
                </div>
                <div><label>Stream eligibility</label>
                  <select>
                    <option>Any Stream</option><option>Science</option><option>Commerce</option><option>Arts</option>
                  </select>
                </div>
              </div>
              <div className="form-row"><label>Short description</label><textarea placeholder="One or two sentences describing what this career involves…"></textarea></div>
              <div className="form-row-2">
                <div><label>Salary range (India)</label><input type="text" placeholder="e.g. ₹6–22 LPA" /></div>
                <div><label>Market demand</label>
                  <select><option>High</option><option>Growing</option><option>Emerging</option></select>
                </div>
              </div>
              <div className="form-row-2">
                <div><label>NSQF level</label><input type="number" placeholder="e.g. 6" min="1" max="10" /></div>
                <div><label>Min. qualification</label><input type="text" placeholder="e.g. Bachelor's degree" /></div>
              </div>
              <div className="form-row"><label>Key skills (comma separated)</label><input type="text" placeholder="e.g. Python, Data Analysis, Communication" /></div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowAddModal(false); showToast('Career saved successfully'); }}>Save career →</button>
            </div>
          </div>
        </div>
      )}

      {showBlogModal && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setShowBlogModal(false); }}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-head-title">New article</div>
              <button className="modal-close" onClick={() => setShowBlogModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row"><label>Article title</label><input type="text" placeholder="e.g. The rise of green careers in India" /></div>
              <div className="form-row-2">
                <div><label>Category</label>
                  <select><option>Emerging Careers</option><option>Science</option><option>Commerce</option><option>Arts & Design</option><option>Technology</option></select>
                </div>
                <div><label>Status</label>
                  <select><option>Draft</option><option>Published</option></select>
                </div>
              </div>
              <div className="form-row"><label>Introduction / excerpt</label><textarea placeholder="A short paragraph that appears in listing pages…"></textarea></div>
              <div className="form-row"><label>Article body</label><textarea style={{ minHeight: '160px' }} placeholder="Full article content… (Markdown supported)"></textarea></div>
              <div className="form-row"><label>Header image URL</label><input type="text" placeholder="https://…" /></div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShowBlogModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowBlogModal(false); showToast('Article published'); }}>Publish article →</button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div>
    </div>
  );
}
