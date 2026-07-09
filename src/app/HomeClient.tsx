'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface DBBlog {
  id: string;
  title: string;
  slug: string;
  category?: string;
  status?: string;
  excerpt?: string;
  content?: string;
  image_url?: string;
  read_time_minutes?: number;
  created_at: string;
  updated_at: string;
}

interface HomeClientProps {
  initialBlogs: DBBlog[];
}

const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  } catch (e) {
    return "March 2026";
  }
};

export default function HomeClient({ initialBlogs }: HomeClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1); // Reset step on close
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const toggleAction = (action: string) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(selectedActions.filter((a) => a !== action));
    } else if (selectedActions.length < 2) {
      setSelectedActions([...selectedActions, action]);
    }
  };

  const toggleIndustry = (industry: string) => {
    if (industry === 'Not sure yet!') {
      setSelectedIndustries(['Not sure yet!']);
      return;
    }
    
    let newInd = selectedIndustries.filter(i => i !== 'Not sure yet!');
    if (newInd.includes(industry)) {
      setSelectedIndustries(newInd.filter((i) => i !== industry));
    } else if (newInd.length < 3) {
      setSelectedIndustries([...newInd, industry]);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/careers?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/careers');
    }
  };

  return (
    <>
      {/* NAV */}
      <Navigation onCtaClick={openModal} />

      {/* HERO */}
      <section>
        <div className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow"><span></span>Career Discovery Platform</div>
            <h1 className="hero-title">Beyond doctor.<br/><em>Beyond engineer.</em><br/>Beyond limits.</h1>
            <p className="hero-sub">Explore 600+ career paths designed for Indian students — with real salary data, growth trends, and step-by-step roadmaps.</p>
            <form className="search-wrap" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Search a career — try 'Pilot' or 'UX Designer'" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="search-btn" type="submit">Explore →</button>
            </form>
            <div className="hero-tags">
              {['Creative', 'Technology', 'Science', 'Commerce', 'Arts & Design', 'Nature'].map(tag => (
                <button 
                  key={tag} 
                  className="hero-tag" 
                  onClick={() => {
                    setSearchQuery(tag);
                    router.push(`/careers?query=${encodeURIComponent(tag)}`);
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-right">
            <Link href="/career/IND-4f0c7f88d236" className="float-card">
              <div className="float-card-top">
                <span className="float-card-name">UX Designer</span>
                <span className="float-card-tag">Creative</span>
              </div>
              <p className="float-card-desc">Shape how millions of people interact with digital products every day.</p>
              <div className="float-card-meta">
                <div className="float-card-stat"><strong>₹6–22 LPA</strong>Salary range</div>
                <div className="float-card-stat"><strong>High</strong>Demand</div>
                <div className="float-card-stat"><strong>Any stream</strong>Eligibility</div>
              </div>
            </Link>
            <Link href="/career/IND-17381a6c80e8" className="float-card" style={{ marginLeft: '24px' }}>
              <div className="float-card-top">
                <span className="float-card-name">Marine Biologist</span>
                <span className="float-card-tag">Science</span>
              </div>
              <p className="float-card-desc">Study ocean ecosystems, protect marine life, and work at the edge of the known world.</p>
              <div className="float-card-meta">
                <div className="float-card-stat"><strong>₹4–18 LPA</strong>Salary range</div>
                <div className="float-card-stat"><strong>Growing</strong>Demand</div>
                <div className="float-card-stat"><strong>Science</strong>Eligibility</div>
              </div>
            </Link>
            <Link href="/career/IND-FA0001" className="float-card">
              <div className="float-card-top">
                <span className="float-card-name">Forensic Accountant</span>
                <span className="float-card-tag">Commerce</span>
              </div>
              <p className="float-card-desc">Investigate financial crimes and uncover fraud hidden in spreadsheets and ledgers.</p>
              <div className="float-card-meta">
                <div className="float-card-stat"><strong>₹8–30 LPA</strong>Salary range</div>
                <div className="float-card-stat"><strong>High</strong>Demand</div>
                <div className="float-card-stat"><strong>Commerce</strong>Eligibility</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-strip">
        <div className="stat-item">
          <span className="stat-number">600+</span>
          <div className="stat-label">Career options</div>
        </div>
        <div className="stat-item">
          <span className="stat-number">All</span>
          <div className="stat-label">Streams covered</div>
        </div>
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <div className="stat-label">India-specific salary data</div>
        </div>
      </div>

      {/* CAREERS SECTION */}
      <section className="section">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Explore</div>
            <h2 className="section-title">Careers worth<br/>knowing about</h2>
          </div>
          <Link href="/careers" className="section-link">View all 600+ →</Link>
        </div>

        <div className="filter-pills" id="filterPills">
          {['All', 'Creative', 'Technology', 'Science', 'Commerce', 'Nature', 'People & Society'].map(filter => (
            <button 
              key={filter}
              className={`pill ${activeFilter === filter ? 'active' : ''}`} 
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="careers-grid">
          {[
            {
              id: 'IND-1e60d1556d2a',
              cat: 'Technology',
              name: 'AI/ML Engineer',
              desc: 'Build the systems that power intelligent applications, from recommendation engines to language models.',
              salary: '₹12–50 LPA',
              demandClass: 'demand-high',
              demand: 'High demand'
            },
            {
              id: 'IND-0697987cc583',
              cat: 'Creative',
              name: 'Game Developer',
              desc: 'Craft interactive worlds, mechanics, and stories that millions of players experience firsthand.',
              salary: '₹5–25 LPA',
              demandClass: 'demand-high',
              demand: 'High demand'
            },
            {
              id: 'IND-1518362a624c',
              cat: 'Science',
              name: 'Environmental Scientist',
              desc: 'Analyze ecosystems, study climate impact, and advise governments on sustainability policy.',
              salary: '₹4–16 LPA',
              demandClass: 'demand-mid',
              demand: 'Growing'
            },
            {
              id: 'IND-ef93e9a4df7d',
              cat: 'Commerce',
              name: 'Investment Banker',
              desc: 'Advise corporations on mergers, acquisitions, and capital raising at the highest levels of finance.',
              salary: '₹15–80 LPA',
              demandClass: 'demand-high',
              demand: 'High demand'
            },
            {
              id: 'IND-69b7e50e64d8',
              cat: 'People & Society',
              name: 'Organizational Psychologist',
              desc: 'Help companies build healthier workplaces by understanding human behavior and motivation at work.',
              salary: '₹6–20 LPA',
              demandClass: 'demand-mid',
              demand: 'Growing'
            },
            {
              id: 'IND-2fa342702be0',
              cat: 'Technology',
              name: 'Cybersecurity Analyst',
              desc: 'Defend digital infrastructure from hackers, protect data, and respond to live security threats.',
              salary: '₹8–35 LPA',
              demandClass: 'demand-high',
              demand: 'High demand'
            }
          ]
          .filter(c => activeFilter === 'All' || c.cat === activeFilter)
          .map(c => (
            <Link href={`/career/${c.id}`} key={c.id} className="career-card">
              <div className="career-card-cat">{c.cat}</div>
              <div className="career-card-name">{c.name}</div>
              <p className="career-card-desc">{c.desc}</p>
              <div className="career-card-footer">
                <span className="career-card-salary">{c.salary}</span>
                <span className={`career-card-demand ${c.demandClass}`}>{c.demand}</span>
              </div>
            </Link>
          ))}
          {/* Show empty state if filtering results in 0 cards */}
          {[
            { id: '1', cat: 'Technology' },
            { id: '2', cat: 'Creative' },
            { id: '3', cat: 'Science' },
            { id: '4', cat: 'Commerce' },
            { id: '5', cat: 'People & Society' },
            { id: '6', cat: 'Technology' }
          ].filter(c => activeFilter === 'All' || c.cat === activeFilter).length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
              Explore more {activeFilter.toLowerCase()} careers by clicking &quot;View all 600+ →&quot; above.
            </div>
          )}
        </div>
      </section>

      {/* BLOG SECTION */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Latest Insights</div>
            <h2 className="section-title">Deep dives worth<br/>your time</h2>
          </div>
          <Link href="/blog" className="section-link">All articles →</Link>
        </div>
        <div className="blog-grid">
          {(initialBlogs || []).slice(0, 3).map((dbBlog) => {
            const blog = {
              slug: dbBlog.slug,
              title: dbBlog.title,
              category: dbBlog.category || "General",
              image: dbBlog.image_url || "/images/blog/ai_future.png",
              time: dbBlog.read_time_minutes ? `${dbBlog.read_time_minutes} min read` : "5 min read",
              date: formatDate(dbBlog.updated_at || dbBlog.created_at)
            };
            return (
              <Link href={`/blog/${blog.slug}`} key={blog.slug} className="blog-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="blog-img" style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image src={blog.image} alt={blog.title} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="blog-body">
                  <div className="blog-cat">{blog.category}</div>
                  <div className="blog-title">{blog.title}</div>
                  <div className="blog-meta">{blog.time} · {blog.date}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA BANNER */}
      <div style={{ padding: '0 48px' }}>
        <div className="cta-banner">
          <div className="cta-banner-left">
            <div className="cta-banner-eyebrow">Start your journey</div>
            <div className="cta-banner-title">Find the career that<br/>was made for you.</div>
            <p className="cta-banner-sub">Answer 3 quick questions and we&apos;ll surface careers<br/>matched to your stream, interests, and personality.</p>
          </div>
          <button className="cta-banner-btn" onClick={openModal}>Discover your path →</button>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />

      {/* ONBOARDING MODAL */}
      <div 
        className={`modal-overlay ${isModalOpen ? 'open' : ''}`} 
        id="modalOverlay" 
        onClick={(e) => {
          if ((e.target as HTMLElement).id === 'modalOverlay') closeModal();
        }}
      >
        <div className="modal">
          <button className="modal-close" onClick={closeModal}>×</button>
          <div className="modal-progress">
            <div className={`modal-dot ${currentStep >= 1 ? 'done' : ''}`} id="dot1"></div>
            <div className={`modal-dot ${currentStep >= 2 ? 'done' : ''}`} id="dot2"></div>
            <div className={`modal-dot ${currentStep >= 3 ? 'done' : ''}`} id="dot3"></div>
          </div>

          {/* Step 1 */}
          <div className={`modal-step ${currentStep === 1 ? 'active' : ''}`} id="step1">
            <div className="modal-eyebrow">Step 1 of 3</div>
            <div className="modal-title">What&apos;s your stream?</div>
            <p className="modal-sub">This helps us show you careers you&apos;re actually eligible for.</p>
            <div className="modal-options">
              {['Science', 'Commerce', 'Arts / Humanities', 'Any stream'].map((stream, idx) => {
                const icons = ['🔬', '📊', '🎨', '🌐'];
                return (
                  <button 
                    key={stream}
                    className={`modal-option ${selectedStream === stream ? 'selected' : ''}`} 
                    onClick={() => setSelectedStream(stream)}
                  >
                    <span className="modal-option-icon">{icons[idx]}</span> {stream}
                  </button>
                )
              })}
            </div>
            <button className="modal-next" onClick={() => nextStep(2)} disabled={!selectedStream}>Continue →</button>
          </div>

          {/* Step 2 */}
          <div className={`modal-step ${currentStep === 2 ? 'active' : ''}`} id="step2">
            <div className="modal-eyebrow">Step 2 of 3</div>
            <div className="modal-title">What kind of work excites you?</div>
            <p className="modal-sub">Select 1 or 2 options that sound the most fun.</p>
            <div className="modal-options" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Solving complex problems & analyzing data', icon: '🧩' },
                { label: 'Designing, writing, or creating art', icon: '🎨' },
                { label: 'Helping, teaching, or advising people', icon: '🤝' },
                { label: 'Leading teams, selling, or managing', icon: '📈' },
                { label: 'Building things, coding, or working with tools', icon: '⚙️' },
                { label: 'Organizing data, planning, and managing details', icon: '📊' }
              ].map((action) => (
                <button 
                  key={action.label}
                  className={`modal-option ${selectedActions.includes(action.label) ? 'selected' : ''}`} 
                  onClick={() => toggleAction(action.label)}
                  style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <span className="modal-option-icon">{action.icon}</span> 
                  <span style={{ fontSize: '15px' }}>{action.label}</span>
                </button>
              ))}
            </div>
            <button className="modal-next" onClick={() => nextStep(3)} disabled={selectedActions.length === 0}>Continue →</button>
          </div>

          {/* Step 3 */}
          <div className={`modal-step ${currentStep === 3 ? 'active' : ''}`} id="step3">
            <div className="modal-eyebrow">Step 3 of 3</div>
            <div className="modal-title">Which areas are you curious about?</div>
            <p className="modal-sub">Select 1 to 3 industries.</p>
            <div className="modal-chips">
              {['Business & Finance', 'Technology & AI', 'Healthcare & Science', 'Media & Design', 'Environment & Nature', 'Public Service & Law', 'Not sure yet!'].map(industry => (
                <button 
                  key={industry}
                  className={`modal-chip ${selectedIndustries.includes(industry) ? 'selected' : ''}`} 
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </button>
              ))}
            </div>
            <a href={`/careers?stream=${selectedStream}&actions=${encodeURIComponent(selectedActions.join('|'))}&industries=${encodeURIComponent(selectedIndustries.join('|'))}`} style={{ textDecoration: 'none' }}>
              <button className="modal-next" style={{ background: '#1e7e34', width: '100%' }} disabled={selectedIndustries.length === 0}>
                See my careers ✦
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );

  function nextStep(n: number) {
    setCurrentStep(n);
  }
}
