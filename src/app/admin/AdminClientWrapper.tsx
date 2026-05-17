'use client';

import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { fetchCareers as serverFetchCareers, saveCareer, deleteCareer, saveBlog, fetchBlogs as serverFetchBlogs, deleteBlog } from '@/lib/actions';
import type { User } from '@supabase/supabase-js';
import type { CareerObj, BlogObj } from './AdminContent';

const AdminContent = dynamic(() => import('./AdminContent'), {
  loading: () => <div className="admin-shell"><main className="admin-main"><div className="admin-content">Loading security context...</div></main></div>,
  ssr: false
});

export default function AdminClientWrapper({ user, initialCareers, initialBlogs }: { user: User; initialCareers: CareerObj[]; initialBlogs: BlogObj[] }) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCareer, setEditingCareer] = useState<CareerObj | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogObj | null>(null);

  const [formData, setFormData] = useState({
    career_id: '',
    career_name: '',
    industry: 'Technology',
    stream: 'Any Stream',
    salary_range_india: '',
    demand_trend: 'High',
    description: ''
  });

  const [careers, setCareers] = useState<CareerObj[]>(initialCareers);
  const [blogs, setBlogs] = useState<BlogObj[]>(initialBlogs);

  const [blogFormData, setBlogFormData] = useState({
    title: '',
    slug: '',
    category: 'Emerging Careers',
    status: 'Published',
    excerpt: '',
    content: '',
    image_url: ''
  });

  const fetchCareers = useCallback(async () => {
    try {
      const data = await serverFetchCareers();
      if (data) setCareers(data);
    } catch (err) {
      console.warn('Backend fetch policy restriction or network error');
    }
  }, []);

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

  const fetchBlogs = useCallback(async () => {
    try {
      const data = await serverFetchBlogs();
      if (data) setBlogs(data);
    } catch (err) {
      console.warn('Backend fetch policy restriction or network error');
    }
  }, []);

  const handleSaveBlog = async () => {
    try {
      if (!blogFormData.title) {
        showToast('Please enter an article title');
        return;
      }
      
      const slug = blogFormData.slug || blogFormData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const words = blogFormData.content.trim().split(/\s+/).length;
      const read_time_minutes = Math.max(1, Math.ceil(words / 200));

      const payload: any = {
        ...blogFormData,
        slug,
        read_time_minutes
      };
      
      if (editingBlog) {
        payload.id = editingBlog.id;
      }

      await saveBlog(payload);
      setShowBlogModal(false);
      showToast(editingBlog ? 'Article updated' : 'Article published');
      setEditingBlog(null);
      setBlogFormData({
        title: '',
        slug: '',
        category: 'Emerging Careers',
        status: 'Published',
        excerpt: '',
        content: '',
        image_url: ''
      });
      fetchBlogs();
      router.refresh();
    } catch (err) {
      showToast(editingBlog ? 'Failed to update article' : 'Failed to publish article');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin';
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

  const handleDeleteBlog = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await deleteBlog(id);
      showToast('Article deleted successfully');
      fetchBlogs();
      router.refresh();
    } catch (err) {
      showToast('Failed to delete article');
    }
  };

  return (
    <>
      <AdminContent 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        careers={careers}
        filteredCareers={filteredCareers}
        blogs={blogs}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleLogout={handleLogout}
        handleDelete={handleDelete}
        handleDeleteBlog={handleDeleteBlog}
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
        setShowBlogModal={(show: boolean, blog?: BlogObj) => {
          if (show) {
            if (blog) {
              setEditingBlog(blog);
              setBlogFormData({
                title: blog.title || '',
                slug: blog.slug || '',
                category: blog.category || 'Emerging Careers',
                status: blog.status || 'Draft',
                excerpt: blog.excerpt || '',
                content: blog.content || '',
                image_url: blog.image_url || ''
              });
            } else {
              setEditingBlog(null);
              setBlogFormData({
                title: '',
                slug: '',
                category: 'Emerging Careers',
                status: 'Draft',
                excerpt: '',
                content: '',
                image_url: ''
              });
            }
          }
          setShowBlogModal(show);
        }}
        getDemandClass={getDemandClass}
      />


      {/* MODALS */}
      {showAddModal && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-head-title">{editingCareer ? 'Edit career' : 'Add new career'}</div>
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
              <button className="btn btn-primary" onClick={() => handleSave(formData)}>{editingCareer ? 'Update career' : 'Save career'} →</button>
            </div>
          </div>
        </div>
      )}

      {showBlogModal && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setShowBlogModal(false); }}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-head-title">{editingBlog ? 'Edit article' : 'New article'}</div>
              <button className="modal-close" onClick={() => setShowBlogModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row"><label>Article title</label><input type="text" placeholder="e.g. The rise of green careers in India" value={blogFormData.title} onChange={e => setBlogFormData({...blogFormData, title: e.target.value})} /></div>
              <div className="form-row-2">
                <div><label>Category</label>
                  <select value={blogFormData.category} onChange={e => setBlogFormData({...blogFormData, category: e.target.value})}><option>Emerging Careers</option><option>Science</option><option>Commerce</option><option>Arts & Design</option><option>Technology</option></select>
                </div>
                <div><label>Status</label>
                  <select value={blogFormData.status} onChange={e => setBlogFormData({...blogFormData, status: e.target.value})}><option>Draft</option><option>Published</option></select>
                </div>
              </div>
              <div className="form-row"><label>Introduction / excerpt</label><textarea placeholder="A short paragraph that appears in listing pages…" value={blogFormData.excerpt} onChange={e => setBlogFormData({...blogFormData, excerpt: e.target.value})}></textarea></div>
              <div className="form-row">
                <label>Article body</label>
                <input 
                  type="file" 
                  accept=".md" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setBlogFormData(prev => ({...prev, content: event.target?.result as string}));
                      }
                    };
                    reader.readAsText(file);
                  }} 
                  style={{ marginBottom: '8px', fontSize: '13px' }} 
                />
                <textarea style={{ minHeight: '160px' }} placeholder="Full article content… (Markdown supported)" value={blogFormData.content} onChange={e => setBlogFormData({...blogFormData, content: e.target.value})}></textarea>
              </div>
              <div className="form-row"><label>Header image URL</label><input type="text" placeholder="https://…" value={blogFormData.image_url} onChange={e => setBlogFormData({...blogFormData, image_url: e.target.value})} /></div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setShowBlogModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveBlog}>{editingBlog ? 'Update article' : 'Publish article'} →</button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div>
    </>

  );
}
