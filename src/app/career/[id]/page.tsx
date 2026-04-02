import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import MobileNavMenu from '../../MobileNavMenu';

export const runtime = 'edge';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!id) {
    return { title: 'Career Not Found | MoreOptions' };
  }

  const { data: career, error } = await supabase
    .from('careers')
    .select('career_name, description')
    .eq('career_id', id)
    .single();

  if (error || !career) return { title: 'Career Not Found | MoreOptions' };

  return {
    title: `${career.career_name} - Salary, Pathways & Eligibility in India`,
    description: career.description || `Explore the career pathway, typical salary in India, and overall market demand for becoming a ${career.career_name}.`,
    openGraph: {
      title: `${career.career_name} Career Guide | MoreOptions`,
      description: career.description || `Explore the career pathway, typical salary in India, and overall market demand for becoming a ${career.career_name}.`,
    }
  };
}

export default async function CareerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return notFound();
  }

  let career = null;
  let error = null;

  if (id === 'IND-FA0001') {
    career = {
      career_id: 'IND-FA0001',
      career_name: 'Forensic Accountant',
      industry: 'Finance',
      minimum_qualification: "Bachelor's in Commerce/Finance, followed by CA/CPA and CFAP certification",
      typical_pathways: '10+2 (Commerce) -> B.Com/BBA -> CA/CPA -> Post Qualification Course in Forensic Accounting and Fraud Detection (FAFD)',
      nsqf_level: 7,
      skills_tags: 'Fraud Detection, Financial Modeling, Auditing, Data Analysis, Legal Knowledge',
      salary_range_india: '₹6.0L - ₹15.0L/year (estimate)',
      demand_trend: 'High',
      stream: 'Commerce (Mathematics preferred)',
      description: 'Forensic Accountants are financial detectives who investigate fraud, embezzlement, and financial crimes. They analyze complex financial records to uncover discrepancies and often work closely with law enforcement agencies or serve as expert witnesses in court proceedings. In India, with the rise of corporate frauds and digital transactions, the demand for forensic accountants has surged among Big 4 accounting firms, regulatory bodies like SEBI, and specialized financial consulting firms. The role requires meticulous attention to detail and strong accounting expertise.'
    };
  } else {
    const res = await supabase
      .from('careers')
      .select('*')
      .eq('career_id', id)
      .single();
    career = res.data;
    error = res.error;
  }

  if (error || !career) {
    return notFound();
  }

  const { data: related } = await supabase
    .from('careers')
    .select('career_id, career_name, salary_range_india, demand_trend')
    .eq('industry', career.industry)
    .neq('career_id', career.career_id)
    .limit(4);

  // Parse data
  const skills = career.skills_tags ? career.skills_tags.split(',').map((s: string) => s.trim()) : [];
  const pathways = career.typical_pathways ? career.typical_pathways.split(';').map((s: string) => s.trim()) : [];
  
  const currentNsqf = 6;
  const nsqfLevels = [1,2,3,4,5,6,7,8,9,10];
  const demandClass = career.demand_trend?.toLowerCase() === 'high' ? 'd-high' : career.demand_trend?.toLowerCase() === 'growing' ? 'd-mid' : 'd-new';

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Occupation",
    "name": career.career_name,
    "description": career.description,
    "occupationalCategory": career.industry,
    "requirements": career.minimum_qualification
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav>
        <Link href="/" className="nav-logo">MoreOptions</Link>
        <ul className="nav-links">
          <li><Link href="/careers">Explore Careers</Link></li>
          <li><Link href="/blog">Insights</Link></li>
          <li><Link href="#">For Counselors</Link></li>
        </ul>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <Link href="/">
            <button className="nav-cta">Discover yours →</button>
          </Link>
          <MobileNavMenu />
        </div>
      </nav>

      <div className="breadcrumb">
        <Link href="/">Home</Link> / <Link href="/careers">Careers</Link> / <span>{career.career_name}</span>
      </div>

      {/* CAREER HERO */}
      <div className="career-hero">
        <div>
          <div className="career-cat">{career.industry}</div>
          <h1 className="career-title">{career.career_name}</h1>
          <p className="career-desc">{career.description || 'Detailed description coming soon.'}</p>
          <div className="career-tags">
            <span className="career-tag">{career.stream || 'Any Stream'}</span>
            <span className="career-tag">NSQF Level 6</span>
          </div>
          <div className="career-actions">
            <button className="btn btn-primary">Save this career</button>
            <button className="btn btn-ghost">Share →</button>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-title">At a glance</div>
          <div className="stat-row">
            <div className="stat-row-label">Salary range in India</div>
            <div className="stat-row-value">{career.salary_range_india || 'N/A'}</div>
          </div>
          <div className="stat-row">
            <div className="stat-row-label">Market demand</div>
            <div className="stat-row-value">{career.demand_trend || 'Unknown'}</div>
            <div className="demand-bar-wrap">
              <div className="demand-bar-track"><div className="demand-bar-fill" style={{ width: career.demand_trend?.toLowerCase() === 'high' ? '90%' : '60%' }}></div></div>
              <div className="demand-bar-labels"><span>Low</span><span>Very High</span></div>
            </div>
          </div>
          <div className="stat-row">
            <div className="stat-row-label">Minimum qualification</div>
            <div className="stat-row-value">{career.minimum_qualification || 'N/A'}</div>
          </div>
          <div className="stat-row">
            <div className="stat-row-label">Work environment</div>
            <div className="stat-row-value">Office / Hybrid / Remote</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="career-content">
        <div className="career-main">

          {/* PATHWAY */}
          <div className="content-section">
            <h2 className="content-h2">Your pathway into {career.career_name}</h2>
            <div className="pathway">
              {pathways.length > 0 ? pathways.map((path: string, idx: number) => (
                <div className="pathway-step" key={idx}>
                  <div className="pathway-dot">{idx + 1}</div>
                  <div className="pathway-body">
                    <div className="pathway-label">Step {idx + 1}</div>
                    <div className="pathway-title">{path}</div>
                  </div>
                </div>
              )) : (
                <div className="pathway-step">
                  <div className="pathway-dot">1</div>
                  <div className="pathway-body">
                    <div className="pathway-label">Initial step</div>
                    <div className="pathway-title">Complete {career.minimum_qualification || 'relevant education'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SKILLS */}
          <div className="content-section">
            <h2 className="content-h2">Skills you&apos;ll need</h2>
            <div className="skills-grid">
              {skills.map((s: string, idx: number) => (
                <div className="skill-item" key={idx}>
                  <div className="skill-name">{s}</div>
                  <div className="skill-type">Core skill</div>
                </div>
              ))}
            </div>
          </div>

          {/* SALARY */}
          <div className="content-section">
            <h2 className="content-h2">Salary breakdown in India</h2>
            <div className="salary-bands">
              <div className="salary-band">
                <div className="salary-band-label">Junior (0–2 yrs)</div>
                <div className="salary-band-bar-wrap">
                  <div className="salary-band-track"><div className="salary-band-fill" style={{ width: '30%' }}></div></div>
                </div>
                <div className="salary-band-val">Entry Level</div>
              </div>
              <div className="salary-band">
                <div className="salary-band-label">Mid (2–5 yrs)</div>
                <div className="salary-band-bar-wrap">
                  <div className="salary-band-track"><div className="salary-band-fill" style={{ width: '55%' }}></div></div>
                </div>
                <div className="salary-band-val">Mid Level</div>
              </div>
              <div className="salary-band">
                <div className="salary-band-label">Senior (5–8 yrs)</div>
                <div className="salary-band-bar-wrap">
                  <div className="salary-band-track"><div className="salary-band-fill top" style={{ width: '75%' }}></div></div>
                </div>
                <div className="salary-band-val">{career.salary_range_india}</div>
              </div>
              <div className="salary-band">
                <div className="salary-band-label">Lead / Head</div>
                <div className="salary-band-bar-wrap">
                  <div className="salary-band-track"><div className="salary-band-fill top" style={{ width: '100%' }}></div></div>
                </div>
                <div className="salary-band-val">Upper Range</div>
              </div>
            </div>
          </div>

          {/* ABOUT */}
          <div className="content-section">
            <h2 className="content-h2">What does a {career.career_name} actually do?</h2>
            <p className="content-p">{career.description || 'Description not available yet. Our team is actively researching and adding new content for this career.'}</p>
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="career-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-title">NSQF Level</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: '28px', letterSpacing: '-0.5px', color: 'var(--text)', marginBottom: '6px' }}>Level 6</div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>Estimated level based on the National Skills Qualification Framework.</div>
            <div className="nsqf-levels">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', marginTop: '14px', width: '100%' }}>
                  {nsqfLevels.map(l => (
                    <div 
                      key={l}
                      style={{
                        flex: 1, height: `${l*5+10}px`, borderRadius: '2px 2px 0 0',
                        background: l <= currentNsqf ? 'var(--accent)' : 'var(--border)',
                        opacity: l === currentNsqf ? 1 : l < currentNsqf ? 0.5 : 0.2
                      }}
                    ></div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '10px', color: 'var(--text3)', marginTop: '4px' }}>
                  <span>1</span><span>10</span>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card-title">Demand trend</div>
            <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '14px', lineHeight: 1.6 }}>Demand for {career.career_name} is considered <strong style={{ color: 'var(--text)', textTransform:'capitalize' }}>{career.demand_trend || 'growing'}</strong>.</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
              <div style={{ flex: 1, background: 'var(--accent)', opacity: 0.25, borderRadius: '3px 3px 0 0', height: '30%' }}></div>
              <div style={{ flex: 1, background: 'var(--accent)', opacity: 0.35, borderRadius: '3px 3px 0 0', height: '45%' }}></div>
              <div style={{ flex: 1, background: 'var(--accent)', opacity: 0.5, borderRadius: '3px 3px 0 0', height: '55%' }}></div>
              <div style={{ flex: 1, background: 'var(--accent)', opacity: 0.65, borderRadius: '3px 3px 0 0', height: '70%' }}></div>
              <div style={{ flex: 1, background: 'var(--accent)', opacity: 0.8, borderRadius: '3px 3px 0 0', height: '80%' }}></div>
              <div style={{ flex: 1, background: 'var(--accent)', borderRadius: '3px 3px 0 0', height: '100%' }}></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text3)', marginTop: '6px' }}><span>2019</span><span>2024</span></div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card-title">Related careers</div>
            <div className="related-card">
              {related && related.map((rc: any) => (
                <Link href={`/career/${rc.career_id}`} className="related-item" key={rc.career_id}>
                  <div className="related-name">{rc.career_name}</div>
                  <div className="related-salary">{rc.salary_range_india} · {rc.demand_trend}</div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
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
