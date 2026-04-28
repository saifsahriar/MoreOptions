export const blogs = [
  {
    slug: 'why-ai-wont-replace-careers',
    title: "Why AI won't replace these 12 careers — it will create them",
    category: "Emerging Careers",
    image: "/images/blog/ai_future.png",
    desc: "The conversation around AI and jobs is mostly fear. Here's the part nobody talks about: the entirely new professions that are emerging because of AI, and how Indian students can position themselves now.",
    time: "12 min read",
    date: "March 2026",
    featured: true
  },
  {
    slug: 'beyond-ca',
    title: "Beyond CA: 20 commerce careers most counselors won't tell you about",
    category: "Commerce",
    image: "/images/blog/commerce.png",
    desc: "From actuarial science to forensic accounting — the high-paying commerce paths that stay hidden.",
    time: "6 min read",
    date: "February 2026"
  },
  {
    slug: 'science-careers-2035',
    title: "The science careers that will matter most in India by 2035",
    category: "Science",
    image: "/images/blog/science.png",
    desc: "Climate science, synthetic biology, and neurotechnology are rewriting what a science degree can unlock.",
    time: "10 min read",
    date: "January 2026"
  },
  {
    slug: 'arts-design-20lpa',
    title: "The arts student's guide to earning ₹20 LPA without switching fields",
    category: "Arts & Design",
    image: "/images/blog/arts_design.png",
    desc: "Design thinking, UX, and content strategy are proving that arts degrees are undervalued — not underpaying.",
    time: "8 min read",
    date: "December 2025"
  },
  {
    slug: 'prompt-engineer',
    title: "What is a Prompt Engineer and why Indian startups are hiring them now",
    category: "Emerging Careers",
    image: "/images/blog/prompt_engineer.png",
    desc: "A new role with no degree requirement, high demand, and salaries that rival software engineering.",
    time: "5 min read",
    date: "November 2025"
  },
  {
    slug: 'cybersecurity-india',
    title: "Cybersecurity in India: the most underpopulated high-paying field",
    category: "Technology",
    image: "/images/blog/cybersecurity.png",
    desc: "Thousands of open roles, shortage of candidates, and starting salaries above ₹8 LPA. Here's the full picture.",
    time: "7 min read",
    date: "October 2025"
  },
  {
    slug: 'marine-biology-india',
    title: "Marine Biology in India: is it actually viable as a career?",
    category: "Science",
    image: "/images/blog/marine_biology.png",
    desc: "The honest, detailed answer — institutions, salaries, research opportunities, and what nobody tells you.",
    time: "9 min read",
    date: "September 2025"
  }
];

export function getBlogBySlug(slug: string) {
  return blogs.find((b) => b.slug === slug);
}
