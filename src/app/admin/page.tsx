'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { fetchCareers as serverFetchCareers, saveCareer, deleteCareer } from '@/lib/actions';
import type { User } from '@supabase/supabase-js';
import type { CareerObj } from './AdminContent';

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
  const [editingCareer, setEditingCareer] = useState<CareerObj | null>(null);

  const [formData, setFormData] = useState({
    career_id: '',
    career_name: '',
    industry: 'Technology',
    stream: 'Any Stream',
    salary_range_india: '',
    demand_trend: 'High',
    description: ''
  });

  const [careers, setCareers] = useState<CareerObj[]>([]);

  const fetchCareers = useCallback(async () => {
    try {
      const data = await serverFetchCareers();
      if (data) setCareers(data);
    } catch (err) {
      console.warn('Backend fetch policy restriction or network error');
      setIsAuthenticated(false);
    }
  }, []);

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
  }, [fetchCareers]);

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this career?')) return;
    try {
      await deleteCareer(id);
      showToast('Career deleted successfully');
      fetchCareers();
    } catch (err) {
      showToast('Failed to delete career');
    }
  };

  const handleSave = async (formData: CareerObj | Omit<CareerObj, 'career_id'>) => {
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

  const getDemandClass = (d?: string) => {
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
        setShowAddModal={(show: boolean, career?: CareerObj) => {
          if (show) {
            if (career) {
              setEditingCareer(career);
              setFormData({
                career_id: career.career_id || '',
                career_name: career.career_name || '',
                industry: career.industry || 'Technology',
                stream: career.stream || 'Any Stream',
                salary_range_india: career.salary_range_india || '',
                demand_trend: career.demand_trend || 'High',
                description: career.description || ''
              });
            } else {
              setEditingCareer(null);
              setFormData({
                career_id: '',
                career_name: '',
                industry: 'Technology',
                stream: 'Any Stream',
                salary_range_india: '',
                demand_trend: 'High',
                description: ''
              });
            }
          }
          setShowAddModal(show)
        }}
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
              <div className="form-row"><label>Career name</label><input type="text" placeholder="e.g. Marine Biologist" value={formData.career_name} onChange={e => setFormData({...formData, career_name: e.target.value})} /></div>
              <div className="form-row-2">
                <div><label>Category</label>
                  <select value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                    <option>Technology</option><option>Creative</option><option>Science</option>
                    <option>Commerce</option><option>People & Society</option><option>Nature</option>
                  </select>
                </div>
                <div><label>Stream eligibility</label>
                  <select value={formData.stream} onChange={e => setFormData({...formData, stream: e.target.value})}>
                    <option>Any Stream</option><option>Science</option><option>Commerce</option><option>Arts</option>
                  </select>
                </div>
              </div>
              <div className="form-row"><label>Short description</label><textarea placeholder="One or two sentences describing what this career involves…" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
              <div className="form-row-2">
                <div><label>Salary range (India)</label><input type="text" placeholder="e.g. ₹6–22 LPA" value={formData.salary_range_india} onChange={e => setFormData({...formData, salary_range_india: e.target.value})} /></div>
                <div><label>Market demand</label>
                  <select value={formData.demand_trend} onChange={e => setFormData({...formData, demand_trend: e.target.value})}><option>High</option><option>Growing</option><option>Emerging</option></select>
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
              <button className="btn btn-primary" onClick={() => handleSave(formData)}>{editingCareer ? 'Update career →' : 'Save career →'}</button>
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
