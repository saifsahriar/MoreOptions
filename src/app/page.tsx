'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStep(1); // Reset step on close
  };

  const toggleChip = (trait: string) => {
    if (selectedTraits.includes(trait)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== trait));
    } else if (selectedTraits.length < 3) {
      setSelectedTraits([...selectedTraits, trait]);
    }
  };

  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-logo">MoreOptions</div>
        <ul className="nav-links">
          <li><Link href="/careers">Explore Careers</Link></li>
          <li><Link href="/blog">Insights</Link></li>
          <li><Link href="#">For Counselors</Link></li>
        </ul>
        <button className="nav-cta" onClick={openModal}>Discover yours →</button>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: '64px' }}>
        <div className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow"><span></span>Career Discovery Platform</div>
            <h1 className="hero-title">Beyond doctor.<br/><em>Beyond engineer.</em><br/>Beyond limits.</h1>
            <p className="hero-sub">Explore 600+ career paths designed for Indian students — with real salary data, growth trends, and step-by-step roadmaps.</p>
            <div className="search-wrap">
              <input type="text" placeholder="Search a career — try 'Pilot' or 'UX Designer'" />
              <button className="search-btn">Explore →</button>
            </div>
            <div className="hero-tags">
              <span className="hero-tag">Creative</span>
              <span className="hero-tag">Technology</span>
              <span className="hero-tag">Science</span>
              <span className="hero-tag">Commerce</span>
              <span className="hero-tag">Arts & Design</span>
              <span className="hero-tag">Nature</span>
            </div>
          </div>

          <div className="hero-right">
            <div className="float-card">
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
            </div>
            <div className="float-card" style={{ marginLeft: '24px' }}>
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
            </div>
            <div className="float-card">
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
            </div>
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
          <div className="career-card">
            <div className="career-card-cat">Technology</div>
            <div className="career-card-name">AI/ML Engineer</div>
            <p className="career-card-desc">Build the systems that power intelligent applications, from recommendation engines to language models.</p>
            <div className="career-card-footer">
              <span className="career-card-salary">₹12–50 LPA</span>
              <span className="career-card-demand demand-high">High demand</span>
            </div>
          </div>
          <div className="career-card">
            <div className="career-card-cat">Creative</div>
            <div className="career-card-name">Game Designer</div>
            <p className="career-card-desc">Craft interactive worlds, mechanics, and stories that millions of players experience firsthand.</p>
            <div className="career-card-footer">
              <span className="career-card-salary">₹5–25 LPA</span>
              <span className="career-card-demand demand-high">High demand</span>
            </div>
          </div>
          <div className="career-card">
            <div className="career-card-cat">Science</div>
            <div className="career-card-name">Environmental Scientist</div>
            <p className="career-card-desc">Analyze ecosystems, study climate impact, and advise governments on sustainability policy.</p>
            <div className="career-card-footer">
              <span className="career-card-salary">₹4–16 LPA</span>
              <span className="career-card-demand demand-mid">Growing</span>
            </div>
          </div>
          <div className="career-card">
            <div className="career-card-cat">Commerce</div>
            <div className="career-card-name">Investment Banker</div>
            <p className="career-card-desc">Advise corporations on mergers, acquisitions, and capital raising at the highest levels of finance.</p>
            <div className="career-card-footer">
              <span className="career-card-salary">₹15–80 LPA</span>
              <span className="career-card-demand demand-high">High demand</span>
            </div>
          </div>
          <div className="career-card">
            <div className="career-card-cat">People & Society</div>
            <div className="career-card-name">Organizational Psychologist</div>
            <p className="career-card-desc">Help companies build healthier workplaces by understanding human behavior and motivation at work.</p>
            <div className="career-card-footer">
              <span className="career-card-salary">₹6–20 LPA</span>
              <span className="career-card-demand demand-mid">Growing</span>
            </div>
          </div>
          <div className="career-card">
            <div className="career-card-cat">Technology</div>
            <div className="career-card-name">Cybersecurity Analyst</div>
            <p className="career-card-desc">Defend digital infrastructure from hackers, protect data, and respond to live security threats.</p>
            <div className="career-card-footer">
              <span className="career-card-salary">₹8–35 LPA</span>
              <span className="career-card-demand demand-high">High demand</span>
            </div>
          </div>
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
          <div className="blog-card">
            <div className="blog-img"><div className="blog-img-inner">✦</div></div>
            <div className="blog-body">
              <div className="blog-cat">Emerging Careers</div>
              <div className="blog-title">Why AI won't replace these 12 careers — it will create them</div>
              <div className="blog-meta">8 min read · Careers & Technology</div>
            </div>
          </div>
          <div className="blog-card">
            <div className="blog-img"><div className="blog-img-inner">◈</div></div>
            <div className="blog-body">
              <div className="blog-cat">Commerce Stream</div>
              <div className="blog-title">Beyond CA: 20 commerce careers most counselors won't tell you about</div>
              <div className="blog-meta">6 min read · Commerce & Finance</div>
            </div>
          </div>
          <div className="blog-card">
            <div className="blog-img"><div className="blog-img-inner">⬡</div></div>
            <div className="blog-body">
              <div className="blog-cat">Science Stream</div>
              <div className="blog-title">The science careers that will matter most in India by 2035</div>
              <div className="blog-meta">10 min read · Science & Research</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <div style={{ padding: '0 48px' }}>
        <div className="cta-banner">
          <div className="cta-banner-left">
            <div className="cta-banner-eyebrow">Start your journey</div>
            <div className="cta-banner-title">Find the career that<br/>was made for you.</div>
            <p className="cta-banner-sub">Answer 3 quick questions and we'll surface careers<br/>matched to your stream, interests, and personality.</p>
          </div>
          <button className="cta-banner-btn" onClick={openModal}>Discover your path →</button>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">MoreOptions</div>
        <div className="footer-links">
          <Link href="#">About</Link>
          <Link href="#">For Schools</Link>
          <Link href="#">Privacy</Link>
          <Link href="#">Contact</Link>
        </div>
        <div className="footer-copy">© 2026 MoreOptions</div>
      </footer>

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
            <div className="modal-title">Where are you now?</div>
            <p className="modal-sub">Your current education level shapes what&apos;s available to you.</p>
            <div className="modal-options">
              {['In 10th grade', 'In 11th / 12th grade', 'In college / graduating'].map((edu, idx) => {
                const icons = ['📚', '🎓', '🏛️'];
                return (
                  <button 
                    key={edu}
                    className={`modal-option ${selectedEducation === edu ? 'selected' : ''}`} 
                    onClick={() => setSelectedEducation(edu)}
                  >
                    <span className="modal-option-icon">{icons[idx]}</span> {edu}
                  </button>
                )
              })}
            </div>
            <button className="modal-next" onClick={() => nextStep(3)} disabled={!selectedEducation}>Continue →</button>
          </div>

          {/* Step 3 */}
          <div className={`modal-step ${currentStep === 3 ? 'active' : ''}`} id="step3">
            <div className="modal-eyebrow">Step 3 of 3</div>
            <div className="modal-title">How would you describe yourself?</div>
            <p className="modal-sub">Pick up to 3 that feel most like you.</p>
            <div className="modal-chips">
              {['Creative', 'Analytical', 'Techy', 'People-person', 'Nature-lover', 'Detail-oriented', 'Leader', 'Problem-solver', 'Artistic', 'Entrepreneurial'].map(trait => (
                <button 
                  key={trait}
                  className={`modal-chip ${selectedTraits.includes(trait) ? 'selected' : ''}`} 
                  onClick={() => toggleChip(trait)}
                >
                  {trait}
                </button>
              ))}
            </div>
            <Link href={`/careers?stream=${selectedStream}&traits=${selectedTraits.join(',')}`}>
              <button className="modal-next" style={{ background: '#1e7e34' }} disabled={selectedTraits.length === 0}>
                See my careers ✦
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  function nextStep(n: number) {
    setCurrentStep(n);
  }
}
