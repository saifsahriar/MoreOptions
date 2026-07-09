'use client';
import { useState, useMemo, useEffect, useDeferredValue, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  salaryNum: number;
  demand: string;
  skills: string[];
};

const ACTION_KEYWORDS: Record<string, string[]> = {
  'Solving complex problems & analyzing data': ['analytical', 'data', 'research', 'logic', 'numerical', 'critical thinking', 'problem solving', 'analysis', 'math', 'statistics', 'troubleshooting'],
  'Designing, writing, or creating art': ['creativity', 'design', 'art', 'storytelling', 'writing', 'drawing', 'visual', 'content', 'media', 'animation', 'aesthetic'],
  'Helping, teaching, or advising people': ['communication', 'customer', 'human resources', 'teaching', 'counseling', 'teamwork', 'interpersonal', 'empathy', 'social', 'training', 'care', 'health'],
  'Leading teams, selling, or managing': ['leadership', 'management', 'strategy', 'sales', 'marketing', 'business', 'planning', 'directing', 'negotiation', 'entrepreneurship'],
  'Building things, coding, or working with tools': ['software', 'programming', 'engineering', 'IT', 'technology', 'technical', 'tools', 'repair', 'construction', 'development', 'coding', 'machinery'],
  'Organizing data, planning, and managing details': ['attention to detail', 'precision', 'accuracy', 'quality control', 'administration', 'organizing', 'finance', 'compliance', 'planning', 'logistics', 'records']
};

const INDUSTRY_MAPPING: Record<string, string[]> = {
  'Business & Finance': ['Finance', 'Banking', 'E-commerce', 'Retail', 'Consulting', 'Real Estate', 'Insurance', 'Logistics', 'Economics', 'Business', 'Accounting', 'Commerce'],
  'Technology & AI': ['Technology', 'Technology & AI', 'Technology & Design', 'Cybersecurity', 'Data & AI', 'IT', 'Software', 'Telecom', 'Electronics', 'Automation'],
  'Healthcare & Science': ['Healthcare', 'Research', 'Biotechnology', 'Science', 'Healthcare & Wellness', 'Healthcare & Biotechnology', 'Medicine', 'Pharmaceuticals'],
  'Media & Design': ['Media & Entertainment', 'Creative Arts', 'Design', 'Animation & VFX', 'Architecture', 'Art & Culture', 'Journalism', 'Publishing', 'Media'],
  'Environment & Nature': ['Agriculture', 'Environment', 'Environmental Services', 'Animal Care & Veterinary', 'Agriculture & Beverage', 'Consulting & Sustainability', 'Nature', 'Oceanography'],
  'Public Service & Law': ['Education', 'Law', 'Govt Services', 'Philanthropy/Social Impact', 'Public Policy', 'Defense', 'Security', 'Non-profit'],
  'Not sure yet!': []
};

export default function CareersClient({ 
  initialCareers
}: { 
  initialCareers: Career[]
}) {
  const topRef = useRef<HTMLDivElement>(null);
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

  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const [streamFilter, setStreamFilter] = useState('All');
  const [interestFilter, setInterestFilter] = useState('All');
  const [demandFilter, setDemandFilter] = useState('All');
  const [minSalary, setMinSalary] = useState(0);
  const [sortOrder, setSortOrder] = useState('relevance');
  
  // New Quiz States
  const [actionsFilter, setActionsFilter] = useState<string[]>([]);
  const [industriesFilter, setIndustriesFilter] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  const router = useRouter();
  const pathname = usePathname();

  const handleSearchUpdate = (val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(window.location.search);
    if (val.trim()) {
      params.set('query', val.trim());
    } else {
      params.delete('query');
    }
    window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const handleUrlSync = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        
        const q = params.get('query') || '';
        setSearchQuery(q);
        
        const s = params.get('stream') || 'All';
        let streamVal = 'All';
        if (s.includes('Science')) streamVal = 'Science';
        else if (s.includes('Commerce')) streamVal = 'Commerce';
        else if (s.includes('Arts') || s.includes('Humanities')) streamVal = 'Arts';
        else if (s.includes('Any')) streamVal = 'Any';
        setStreamFilter(streamVal);
        
        const a = params.get('actions') ? params.get('actions')!.split('|') : [];
        setActionsFilter(a);

        const i = params.get('industries') ? params.get('industries')!.split('|') : [];
        setIndustriesFilter(i);
      }
    };

    handleUrlSync();
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  const processedCareers = useMemo(() => {
    const isQuizActive = actionsFilter.length > 0 || industriesFilter.length > 0;

    let result = initialCareers.map(c => {
      let score = 0;
      
      // 1. Action Mapping Score
      const fullText = [c.name, c.cat, c.desc, ...(c.skills || [])].join(' ').toLowerCase();
      let actionMatched = false;
      if (actionsFilter.length > 0) {
        for (const action of actionsFilter) {
          const keywords = ACTION_KEYWORDS[action] || [];
          let matches = 0;
          keywords.forEach(kw => {
            // Add word boundaries for generic words, or just simple includes
            if (fullText.includes(kw.toLowerCase())) matches++;
          });
          
          if (matches > 0) {
            score += Math.min(50, matches * 15);
            actionMatched = true;
          }
        }
      }

      // 2. Industry Mapping Score
      let industryMatched = false;
      if (industriesFilter.length > 0) {
        if (industriesFilter.includes('Not sure yet!')) {
           score += 20; // Slight boost for all if not sure
           industryMatched = true;
        } else {
          for (const ind of industriesFilter) {
            const mappedCategories = INDUSTRY_MAPPING[ind] || [];
            if (mappedCategories.includes(c.cat) || c.cat === ind) {
              industryMatched = true;
              break;
            }
          }
          if (industryMatched) score += 30;
        }
      }
      
      // 3. Orphaned Career Fallback (Inherit tiny bonus if industry matched but no skills matched)
      if (industriesFilter.length > 0 && industryMatched && actionsFilter.length > 0 && !actionMatched) {
        score += 5; 
      }

      // 4. Demand and Salary Bonuses
      const d = (c.demand || '').toLowerCase();
      if (d === 'high') score += 10;
      else if (d === 'growing') score += 5;

      if (c.salaryNum >= 15) score += 10;
      else if (c.salaryNum >= 8) score += 5;
      
      return { ...c, matchScore: score };
    });

    // Handle Manual Sidebar Filters
    if (deferredSearchQuery) {
      const q = deferredSearchQuery.toLowerCase().trim();
      result = result.filter(c => {
        const fullText = [c.name, c.cat, c.desc, ...(c.skills || [])].join(' ').toLowerCase();
        return fullText.includes(q);
      });
    }

    if (minSalary > 0) {
      result = result.filter(c => c.salaryNum >= minSalary);
    }
    
    if (demandFilter !== 'All') {
      result = result.filter(c => (c.demand || '').toLowerCase() === demandFilter.toLowerCase());
    }

    if (interestFilter !== 'All' && !isQuizActive) {
      // Legacy interest filter for sidebar
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

    // Split by Stream Eligibility
    let eligible: typeof result = [];
    let ineligible: typeof result = [];
    
    result.forEach(c => {
      const s = String(c.stream || '').toLowerCase();
      if (streamFilter === 'All' || streamFilter === 'Any') {
        eligible.push(c);
      } else {
        if (s.includes('any')) {
          eligible.push(c);
        } else if (streamFilter === 'Science' && s.includes('science')) {
          eligible.push(c);
        } else if (streamFilter === 'Commerce' && s.includes('commerce')) {
          eligible.push(c);
        } else if (streamFilter === 'Arts' && (s.includes('arts') || s.includes('humanities'))) {
          eligible.push(c);
        } else {
          ineligible.push(c);
        }
      }
    });

    // Sorting Logic
    const sortFn = (a: any, b: any) => {
      if (!isQuizActive) {
        if (sortOrder === 'salary-high') return b.salaryNum - a.salaryNum;
        if (sortOrder === 'salary-low') return a.salaryNum - b.salaryNum;
        if (sortOrder === 'demand') {
          const dMap: Record<string, number> = { 'high': 3, 'growing': 2, 'emerging': 1 };
          return (dMap[(b.demand || '').toLowerCase()] || 0) - (dMap[(a.demand || '').toLowerCase()] || 0);
        }
        return 0; // relevance
      }
      
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      
      const dMap: Record<string, number> = { 'high': 3, 'growing': 2, 'emerging': 1 };
      const demandDiff = (dMap[(b.demand || '').toLowerCase()] || 0) - (dMap[(a.demand || '').toLowerCase()] || 0);
      if (demandDiff !== 0) return demandDiff;
      
      return b.salaryNum - a.salaryNum;
    };

    eligible.sort(sortFn);
    ineligible.sort(sortFn);
    
    // Dynamic Thresholding (Zero-Result Proof)
    let finalEligible = eligible;
    if (isQuizActive) {
        const topScorers = eligible.filter(c => c.matchScore >= 40);
        if (topScorers.length >= 15) {
            finalEligible = topScorers;
        } else {
            finalEligible = eligible.slice(0, 15); // Guarantee at least 15
        }
    }

    return { 
      eligible: finalEligible, 
      ineligible: isQuizActive ? ineligible.filter(c => c.matchScore >= 30).slice(0, 8) : [] 
    };
  }, [deferredSearchQuery, streamFilter, interestFilter, demandFilter, minSalary, sortOrder, actionsFilter, industriesFilter, initialCareers]);

  const filteredCareers = processedCareers.eligible;
  const totalPages = Math.ceil(filteredCareers.length / PAGE_SIZE);
  const paginatedCareers = filteredCareers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, streamFilter, interestFilter, demandFilter, minSalary, sortOrder, actionsFilter, industriesFilter]);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }, [page]);

  const CareerCard = ({ c }: { c: Career }) => (
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
  );

  return (
    <>
      <Navigation />

      <div className="page-header" ref={topRef}>
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
              onChange={(e) => handleSearchUpdate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-layout">
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

        <main>
          <div className="results-header">
            <div className="results-count"><strong>{filteredCareers.length}</strong> careers found</div>
            <select className="sort-select" value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}>
              <option value="relevance">Sort: Relevance</option>
              <option value="salary-high">Salary: High to Low</option>
              <option value="salary-low">Salary: Low to High</option>
              <option value="demand">Demand</option>
            </select>
          </div>

          {(actionsFilter.length > 0 || industriesFilter.length > 0) && (
             <div style={{ marginBottom: '24px', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#166534', fontSize: '18px' }}>Your Top Matches</h3>
                <p style={{ margin: 0, color: '#15803d', fontSize: '14px' }}>Curated based on your interests and stream.</p>
             </div>
          )}

          <div className="careers-grid">
            {paginatedCareers.map(c => <CareerCard key={c.id} c={c} />)}
          </div>

          {totalPages > 1 && (
            <div suppressHydrationWarning style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1 ? true : undefined}
                suppressHydrationWarning
                style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', background: page === 1 ? '#f5f5f5' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <span style={{ fontSize: '14px', color: '#666' }}>Page {page} of {totalPages}</span>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages ? true : undefined}
                suppressHydrationWarning
                style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '4px', background: page === totalPages ? '#f5f5f5' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          )}

          {processedCareers.ineligible.length > 0 && (
            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #eee' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Matches your interests, but requires a different stream</h3>
              <p style={{ color: '#666', marginBottom: '24px', fontSize: '14px' }}>These careers align with what you like, but you may need to pursue a different educational path or certifications to get there.</p>
              <div className="careers-grid" style={{ opacity: 0.8 }}>
                {processedCareers.ineligible.map(c => <CareerCard key={c.id} c={c} />)}
              </div>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </>
  );
}
