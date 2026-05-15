import { supabase } from '@/lib/supabase';
import SavedClient from '@/app/saved/SavedClient';
import type { Metadata } from 'next';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Saved Careers | MoreOptions',
  description: 'Review and compare the career paths you have bookmarked on MoreOptions.',
};

export default async function SavedPage() {
  // Fetch all careers to pass to client (optimized)
  const { data: rows, error } = await supabase
    .from('careers')
    .select('career_id, career_name, industry, stream, description, salary_range_india, demand_trend, skills_tags')
    .order('career_name');
  
  if (error) {
    console.error("Supabase Error fetching careers:", error);
  }

  const mappedCareers = (rows || []).map((row: Record<string, unknown>) => {
    let salaryStr = row.salary_range_india;
    if (salaryStr === '₹4,00,000 - ₹12,00,000') {
      salaryStr = '₹4.0L - ₹12.0L/year (estimate)';
    }
    
    return {
      id: row.career_id?.toString() || row.id?.toString() || '',
      name: row.career_name as string,
      cat: row.industry as string,
      stream: row.stream as string,
      desc: (row.description as string) || '',
      salary: salaryStr as string,
      demand: ((row.demand_trend as string) || '').toLowerCase(),
      skills: row.skills_tags ? (row.skills_tags as string).split(',').map((s: string) => s.trim()).slice(0, 3) : []
    };
  });

  return <SavedClient allCareers={mappedCareers} />;
}
