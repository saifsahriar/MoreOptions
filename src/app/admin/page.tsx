'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { fetchCareers as serverFetchCareers, saveCareer, deleteCareer } from '@/lib/actions';
import type { User } from '@supabase/supabase-js';

const AdminContent = dynamic(() => import('./AdminContent'), {
  loading: () => <div className="admin-shell"><main className="admin-main"><div className="admin-content">Loading security context...</div></main></div>,
  ssr: false
});

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const fetchCareers = useCallback(async () => {
    try {
      const data = await serverFetchCareers();
      if (data) setCareers(data);
    } catch (err) {
      console.warn('Backend fetch policy restriction or network error');
      setIsAuthenticated(false);
    }
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this career?')) return;
    try {
      await deleteCareer(id);
      showToast('Career deleted successfully');
      fetchCareers();
    } catch (err) {
      showToast('Failed to delete career');
    }
  };

  const handleSave = async (formData: any) => {
    try {
      await saveCareer(formData);
      setShowAddModal(false);
      showToast('Career saved successfully');
      fetchCareers();
    } catch (err) {
      showToast('Failed to save career');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
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
    <>
      <AdminContent 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        careers={careers}
        filteredCareers={filteredCareers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleLogout={handleLogout}
        handleDelete={handleDelete}
        setShowAddModal={setShowAddModal}
        setShowBlogModal={setShowBlogModal}
        getDemandClass={getDemandClass}
      />

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
              <button className="btn btn-primary" onClick={() => { 
                const form = document.querySelector('.modal-body') as any;
                const nameInput = form.querySelector('input[placeholder="e.g. Marine Biologist"]') as HTMLInputElement;
                const industrySelect = form.querySelector('select') as HTMLSelectElement;
                const streamSelect = form.querySelectorAll('select')[1] as HTMLSelectElement;
                const salaryInput = form.querySelector('input[placeholder="e.g. ₹6–22 LPA"]') as HTMLInputElement;
                const demandSelect = form.querySelectorAll('select')[2] as HTMLSelectElement;
                const descText = form.querySelector('textarea') as HTMLTextAreaElement;

                handleSave({
                  career_name: nameInput.value,
                  industry: industrySelect.value,
                  stream: streamSelect.value,
                  salary_range_india: salaryInput.value,
                  demand_trend: demandSelect.value,
                  description: descText.value
                });
              }}>Save career →</button>
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
    </>
  );
}
