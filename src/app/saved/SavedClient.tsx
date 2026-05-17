'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileNavMenu from '../MobileNavMenu';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

type Career = {
  id: string;
  name: string;
  cat: string;
  stream: string;
  desc: string;
  salary: string;
  demand: string;
  skills: string[];
};

export default function SavedClient({ allCareers }: { allCareers: Career[] }) {
  const [savedCareers, setSavedCareers] = useState<Career[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
    let savedIds: string[] = [];
    try {
      const raw = JSON.parse(localStorage.getItem('saved_careers') || '[]');
      savedIds = Array.isArray(raw) ? raw.filter((x: unknown) => typeof x === 'string') : [];
    } catch {
      savedIds = [];
    }
    const filtered = allCareers.filter(c => savedIds.includes(c.id));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavedCareers(filtered);
  }, [allCareers]);

  return (
    <>
      <Navigation />

      <div className="page-header" style={{ paddingBottom: '24px' }}>
        <div>
          <div className="page-eyebrow">Your Shortlist</div>
          <h1 className="page-title">Saved Careers</h1>
          <p className="page-sub">Review and compare the paths you&apos;ve bookmarked.</p>
        </div>
      </div>

      <main style={{ padding: '0 48px 64px' }}>
        {!hasMounted ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text2)' }}>Loading saved careers...</div>
        ) : savedCareers.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.2 }}>♥</div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>No careers saved yet</h3>
            <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>Explore the career library and click &quot;Save this career&quot; to add them here.</p>
            <Link href="/careers">
              <button className="btn btn-primary">Explore Careers</button>
            </Link>
          </div>
        ) : (
          <div className="careers-grid">
            {savedCareers.map(c => (
              <Link href={`/career/${c.id}`} key={c.id} className="career-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="cc-top">
                  <div className="cc-cat">{c.cat}</div>
                  <span className={`cc-demand d-${c.demand === 'high' ? 'high' : c.demand === 'growing' ? 'mid' : 'new'}`}>
                    {c.demand}
                  </span>
                </div>
                <div className="cc-name">{c.name}</div>
                <div className="cc-desc">{c.desc}</div>
                <div className="cc-footer">
                  <div className="cc-salary">{c.salary}</div>
                  <div className="cc-skills">
                    {c.skills.map((s, idx) => <span key={idx} className="cc-skill">{s}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
