import HomeClient from './HomeClient';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // ISR: regenerate every hour

// Career IDs shown on the homepage (hero float cards + careers grid)
const HERO_CARD_IDS  = ['IND-4f0c7f88d236', 'IND-17381a6c80e8', 'IND-FA0001'];
const GRID_CARD_IDS  = [
  'IND-1e60d1556d2a', // AI/ML Engineer
  'IND-0697987cc583', // Game Developer
  'IND-1518362a624c', // Environmental Scientist
  'IND-ef93e9a4df7d', // Investment Banker / Advisor
  'IND-69b7e50e64d8', // Organizational Psychologist
  'IND-2fa342702be0', // Cybersecurity Analyst
];
const ALL_HOME_IDS = [...HERO_CARD_IDS, ...GRID_CARD_IDS];

export default async function LandingPage() {
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .ilike('status', 'published')
    .order('updated_at', { ascending: false });

  // Fetch live career data for all homepage cards
  const { data: homeCareers } = await supabase
    .from('careers')
    .select('career_id, career_name, industry, stream, salary_range_india, demand_trend, description, minimum_qualification')
    .in('career_id', ALL_HOME_IDS);

  // Build a lookup map keyed by career_id for easy access in HomeClient
  const careerMap: Record<string, {
    career_id: string;
    career_name: string;
    industry: string;
    stream: string | null;
    salary_range_india: string | null;
    demand_trend: string | null;
    description: string | null;
    minimum_qualification: string | null;
  }> = {};
  for (const c of homeCareers || []) {
    careerMap[c.career_id] = c;
  }

  return <HomeClient initialBlogs={blogs || []} homeCareers={careerMap} />;
}
