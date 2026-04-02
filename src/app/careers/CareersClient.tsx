'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import MobileNavMenu from '../MobileNavMenu';

type Career = {
  id: string;
  name: string;
  cat: string;
  stream: string;
  desc: string;
  salary: string;
  salaryNum: number;
  demand: string;
  skills: string[];
};

export default function CareersClient({ 
  initialCareers,
  searchParams 
}: { 
  initialCareers: Career[],
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const streamCounts = useMemo(() => {
    const counts = { All: initialCareers.length, Science: 0, Commerce: 0, Arts: 0, Any: 0 };
    initialCareers.forEach(c => {
      const s = String(c.stream || '').toLowerCase();
      if (s.includes('science') || s.includes('any')) counts.Science++;
      if (s.includes('commerce') || s.includes('any')) counts.Commerce++;
      if (s.includes('arts') || s.includes('humanities') || s.includes('any')) counts.Arts++;
      if (s.includes('any')) counts.Any++;
    });
    return counts;
  }, [initialCareers]);

  let initialStream = 'All';
  if (searchParams?.stream) {
    const s = String(searchParams.stream);
    if (s.includes('Science')) initialStream = 'Science';
    else if (s.includes('Commerce')) initialStream = 'Commerce';
    else if (s.includes('Arts') || s.includes('Humanities')) initialStream = 'Arts';
    else if (s.includes('Any')) initialStream = 'Any';
  }
  
  const initialTraits = searchParams?.traits ? String(searchParams.traits).split(',') : [];

  const [searchQuery, setSearchQuery] = useState('');
  const [streamFilter, setStreamFilter] = useState(initialStream);
  const [interestFilter, setInterestFilter] = useState('All');
  const [demandFilter, setDemandFilter] = useState('All');
  const [minSalary, setMinSalary] = useState(0);
  const [sortOrder, setSortOrder] = useState('relevance');
  const [traitsFilter, setTraitsFilter] = useState<string[]>(initialTraits);

  const filteredCareers = useMemo(() => {
    let result = initialCareers;

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => {
        const fullText = [c.name, c.cat, c.desc, ...(c.skills || [])].join(' ').toLowerCase();
        return fullText.includes(q);
      });
    }
    
    if (streamFilter !== 'All') {
      result = result.filter(c => {
        if (!c.stream) return false;
        const s = c.stream.toLowerCase();
        if (streamFilter === 'Science') return s.includes('science') || s.includes('any');
        if (streamFilter === 'Commerce') return s.includes('commerce') || s.includes('any');
        if (streamFilter === 'Arts') return s.includes('arts') || s.includes('humanities') || s.includes('any');
        if (streamFilter === 'Any') return s.includes('any');
        return true;
      });
    }

    if (traitsFilter.length > 0) {
      result = result.filter(c => {
        const fullText = [c.name, c.cat, c.desc, ...(c.skills || [])].join(' ').toLowerCase();
        // Match ANY trait
        return traitsFilter.some(t => fullText.includes(t.toLowerCase().trim()));
      });
    }

    if (interestFilter !== 'All') {
      const map: Record<string, string[]> = {
        'Creative': ['Media & Entertainment', 'Creative Arts', 'Design', 'Animation & VFX', 'Architecture', 'Art & Culture'],
        'Technology': ['IT', 'Data & AI', 'Cybersecurity', 'Telecom', 'Technology & AI', 'Technology & Design', 'Technology & Compliance'],
        'Science': ['Healthcare', 'Research', 'Biotechnology', 'Environment', 'Oceanography', 'Aerospace', 'Healthcare & Wellness', 'Healthcare & Biotechnology'],
        'People': ['Education', 'Law', 'Hospitality', 'Govt Services', 'Psychology', 'Philanthropy/Social Impact', 'Public Policy', 'Hospitality & Beverage', 'Media & Culinary'],
        'Nature': ['Agriculture', 'Environment', 'Environmental Services', 'Animal Care & Veterinary', 'Agriculture & Beverage', 'Consulting & Sustainability'],
        'Commerce': ['Finance', 'E-commerce', 'Banking', 'Retail', 'Logistics & Supply Chain', 'Consulting', 'Real Estate', 'Insurance', 'Logistics', 'Economics']
      };
      
      const allowedIndustries = map[interestFilter] || [];
      result = result.filter(c => allowedIndustries.includes(c.cat) || c.cat === interestFilter);
    }

    if (demandFilter !== 'All') {
      result = result.filter(c => c.demand.toLowerCase() === demandFilter.toLowerCase());
    }

    if (minSalary > 0) {
      result = result.filter(c => c.salaryNum >= minSalary);
    }

    // Sort
    let sorted = [...result];
    if (sortOrder === 'salary-high') {
      sorted.sort((a,b) => b.salaryNum - a.salaryNum);
    } else if (sortOrder === 'salary-low') {
      sorted.sort((a,b) => a.salaryNum - b.salaryNum);
    } else if (sortOrder === 'demand') {
      const dMap: Record<string, number> = { 'high': 3, 'growing': 2, 'emerging': 1 };
      sorted.sort((a,b) => (dMap[b.demand] || 0) - (dMap[a.demand] || 0));
    }

    return sorted;
  }, [searchQuery, streamFilter, interestFilter, demandFilter, minSalary, sortOrder]);

  return (
    <>
      <nav>
        <Link href="/" className="nav-logo">MoreOptions</Link>
        <ul className="nav-links">
          <li><Link href="/careers" className="active">Explore Careers</Link></li>
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

      <div className="page-header">
        <div className="page-header-top">
          <div>
            <div className="page-eyebrow">Discovery Dashboard</div>
            <h1 className="page-title">Explore 600+<br/>career paths</h1>
            <p className="page-sub">Filter by stream, interest, salary, and demand to find what fits you.</p>
          </div>
          <div className="search-bar-wrap">
            <span className="search-icon">⌕</span>
            <input 
              type="text" 
              placeholder="Search careers — try 'Pilot', 'AI'…" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Stream</div>
            <div className="sidebar-options">
              {[
                { label: 'All Streams', val: 'All', count: streamCounts.All },
                { label: 'Science', val: 'Science', count: streamCounts.Science },
                { label: 'Commerce', val: 'Commerce', count: streamCounts.Commerce },
                { label: 'Arts & Humanities', val: 'Arts', count: streamCounts.Arts },
                { label: 'Any Stream', val: 'Any', count: streamCounts.Any },
              ].map(opt => (
                <button 
                  key={opt.val}
                  className={`sidebar-opt ${streamFilter === opt.val ? 'active' : ''}`} 
                  onClick={() => setStreamFilter(opt.val)}
                >
                  {opt.label} <span className="sidebar-count">{opt.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Interest</div>
            <div className="sidebar-options">
              {['All', 'Creative', 'Technology', 'Science', 'People', 'Nature', 'Commerce'].map(opt => (
                <button 
                  key={opt}
                  className={`sidebar-opt ${interestFilter === opt ? 'active' : ''}`} 
                  onClick={() => setInterestFilter(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Min. Salary (LPA)</div>
            <div className="range-row"><span>₹0</span><span>₹{minSalary}+</span></div>
            <input 
              type="range" 
              min="0" max="30" step="5" 
              value={minSalary}
              onChange={(e) => setMinSalary(parseInt(e.target.value))}
            />
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Demand</div>
            <div className="sidebar-options">
              {['All', 'High', 'Growing', 'Emerging'].map(opt => (
                <button 
                  key={opt}
                  className={`sidebar-opt ${demandFilter === opt ? 'active' : ''}`} 
                  onClick={() => setDemandFilter(opt)}
                >
                  {opt === 'High' ? 'High demand' : opt}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <main>
          <div className="results-header">
            <div className="results-count"><strong>{filteredCareers.length}</strong> careers found</div>
            <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="relevance">Sort: Relevance</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
              <option value="demand">Demand</option>
            </select>
          </div>

          <div className="careers-grid">
            {filteredCareers.map(c => (
              <Link href={`/career/${c.id}`} key={c.id} className="career-card">
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


        </main>
      </div>

      <footer>
        <div className="footer-logo">MoreOptions</div>
        <div className="footer-links">
          <Link href="#">About</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Contact</Link>
        </div>
        <div className="footer-copy">© 2026 MoreOptions</div>
      </footer>
    </>
  );
}
