import Link from 'next/link';
import ProgressBar from './ProgressBar';

export const runtime = 'edge';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <nav>
        <Link href="/" className="nav-logo">MoreOptions</Link>
        <ul className="nav-links">
          <li><Link href="/careers">Explore Careers</Link></li>
          <li><Link href="/blog" className="active">Insights</Link></li>
          <li><Link href="#">For Counselors</Link></li>
        </ul>
        <Link href="/">
          <button className="nav-cta">Discover yours →</button>
        </Link>
      </nav>

      <ProgressBar />

      <div className="article-header">
        <div className="article-cat">Emerging Careers · Technology</div>
        <h1 className="article-title">Why AI won&apos;t replace these 12 careers — it will create them</h1>
        <p className="article-desc">The conversation around AI and jobs is mostly fear. Here&apos;s the part nobody talks about: the entirely new professions emerging because of AI.</p>
        <div className="article-meta">
          <span>12 min read</span>
          <div className="article-meta-dot"></div>
          <span>March 2026</span>
          <div className="article-meta-dot"></div>
          <span>Technology</span>
        </div>
      </div>

      <div className="article-hero-img">
        <div className="article-hero-img-inner">
          AI
          <div className="article-hero-img-text">Illustration: MoreOptions</div>
        </div>
      </div>

      <div className="article-layout">
        <article className="article-body prose">
          <p>Every few months, a new study drops claiming that AI will eliminate X% of jobs by 20XX. Students read this and panic. Parents read this and push harder toward &quot;safe&quot; careers. But this framing misses something important: <strong>technological disruption doesn&apos;t just destroy jobs, it creates entirely new categories of work.</strong></p>
          <p>The internet didn&apos;t just eliminate travel agents — it created social media managers, SEO specialists, and e-commerce founders. The smartphone didn&apos;t just replace cameras and maps — it created app developers, influencers, and gig economy platforms. AI will follow the same pattern.</p>

          <blockquote>
            <p>The question isn&apos;t whether AI will change the job market. It already has. The question is: which side of that change will you be on?</p>
          </blockquote>

          <h2>The careers AI is actively building demand for</h2>
          <p>Here are 12 professions that either didn&apos;t exist 5 years ago or have seen explosive growth because of AI — not despite it.</p>

          <div className="inline-card">
            <div className="inline-card-num">01</div>
            <div className="inline-card-text">
              <div className="inline-card-title">AI Prompt Engineer</div>
              <div className="inline-card-desc">Specialists who know how to communicate with large language models to get reliable, high-quality outputs. Salary in India: ₹8–25 LPA. No engineering degree required.</div>
            </div>
          </div>
          <div className="inline-card">
            <div className="inline-card-num">02</div>
            <div className="inline-card-text">
              <div className="inline-card-title">AI Ethics Consultant</div>
              <div className="inline-card-desc">As companies deploy AI systems that affect people&apos;s lives, they need experts who can identify bias, fairness issues, and regulatory risk. A growing and well-paid field.</div>
            </div>
          </div>
          <div className="inline-card">
            <div className="inline-card-num">03</div>
            <div className="inline-card-text">
              <div className="inline-card-title">Human-AI Interaction Designer</div>
              <div className="inline-card-desc">UX designers who specialize in designing interactions between humans and AI systems — chatbots, voice assistants, AI-powered tools. The most in-demand design subspecialty right now.</div>
            </div>
          </div>
          <div className="inline-card">
            <div className="inline-card-num">04</div>
            <div className="inline-card-text">
              <div className="inline-card-title">Data Annotator / AI Trainer</div>
              <div className="inline-card-desc">AI models need humans to label, correct, and improve their outputs. This role is evolving from mechanical work into a skilled profession requiring domain expertise.</div>
            </div>
          </div>

          <h2>Why these careers are durable</h2>
          <p>The common thread across all 12 careers is that they require something AI systems fundamentally lack: <strong>situated judgment</strong>. The ability to understand context, navigate ambiguity, and make value-laden decisions in real-world situations.</p>
          <p>AI is extraordinarily good at pattern recognition over large datasets. It is poor at operating in novel situations, understanding nuanced human relationships, and making ethical trade-offs. Careers that sit at these intersections are not just safe — they&apos;re growth areas.</p>

          <h2>What this means for students choosing now</h2>
          <p>If you&apos;re a student in 10th or 12th grade reading this, here&apos;s the practical implication: <strong>don&apos;t choose a career based on whether it&apos;s AI-proof. Choose one where AI makes you more powerful.</strong></p>
          <p>A lawyer who uses AI to research cases in minutes instead of hours isn&apos;t replaced — they&apos;re 10× more productive and more valuable. A doctor who uses AI diagnostics doesn&apos;t lose their job — they see more patients and catch more edge cases. A designer who uses AI to generate concepts in minutes doesn&apos;t lose their role — they spend their time on strategy and human judgment.</p>
          <p>The students who will thrive are those who develop deep expertise in a domain <em>and</em> learn to work with AI tools. That combination is currently rare and extremely valuable.</p>

          <h2>The careers on the other side</h2>
          <p>To be clear: some roles are genuinely at risk. Highly repetitive, rule-based work — basic data entry, simple content moderation, routine document processing — will see significant automation. If you&apos;re considering a career primarily because it seems stable and repeatable, that&apos;s exactly the profile most vulnerable to AI displacement.</p>
          <p>The safest long-term bet isn&apos;t stability. It&apos;s relevance. Stay curious, stay skilled, and stay close to the problems that actually need human judgment.</p>
        </article>

        <aside className="article-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-card-title">In this article</div>
            <ul className="toc-list">
              <li className="toc-item active"><Link href="#">The careers AI is building demand for</Link></li>
              <li className="toc-item"><Link href="#">Why these careers are durable</Link></li>
              <li className="toc-item"><Link href="#">What this means for students</Link></li>
              <li className="toc-item"><Link href="#">The careers at risk</Link></li>
            </ul>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card-title">Explore related careers</div>
            <div className="related-mini">
              <Link href="/career/aiml-engineer" className="related-mini-item">
                <div className="related-mini-title">AI/ML Engineer</div>
                <div className="related-mini-meta">₹12–50 LPA · High demand</div>
              </Link>
              <Link href="/career/ux-designer" className="related-mini-item">
                <div className="related-mini-title">UX Designer</div>
                <div className="related-mini-meta">₹6–22 LPA · High demand</div>
              </Link>
              <Link href="/career/cybersecurity" className="related-mini-item">
                <div className="related-mini-title">Cybersecurity Analyst</div>
                <div className="related-mini-meta">₹8–35 LPA · High demand</div>
              </Link>
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-card-title">More articles</div>
            <div className="related-mini">
              <Link href="/blog/science-careers-2035" className="related-mini-item">
                <div className="related-mini-title">The science careers that will matter most in India by 2035</div>
                <div className="related-mini-meta">10 min read</div>
              </Link>
              <Link href="/blog/beyond-ca" className="related-mini-item">
                <div className="related-mini-title">Beyond CA: 20 commerce careers nobody tells you about</div>
                <div className="related-mini-meta">6 min read</div>
              </Link>
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
