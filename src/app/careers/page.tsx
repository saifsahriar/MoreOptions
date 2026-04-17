import { supabase } from '@/lib/supabase';
import CareersClient from './CareersClient';

// Using standard Node.js runtime for better networking stability in local development
// export const runtime = 'edge';

export default async function CareersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  // Optimized fetch: only select the columns we actually use
  const { data: rows, error } = await supabase
    .from('careers')
    .select('career_id, career_name, industry, stream, description, salary_range_india, demand_trend, skills_tags')
    .order('career_name');
  
  if (error) {
    console.error("Supabase Error fetching careers:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
  }

  const mappedCareers = (rows || []).map((row: Record<string, unknown>) => {
    let salaryStr = row.salary_range_india;
    if (salaryStr === '₹4,00,000 - ₹12,00,000') {
      salaryStr = '₹4.0L - ₹12.0L/year (estimate)';
    }

    const parseSalaryToLPA = (val: string) => {
      if (!val) return 0;
      const clean = val.replace(/,/g, '');
      const match = clean.match(/\d+(\.\d+)?/);
      if (!match) return 0;
      const num = parseFloat(match[0]);
      // If the string explicitly says L or LPA, and num < 100, we treat it as lakh.
      if (clean.toLowerCase().includes('l') && num < 100) return num;
      // If it's a large value (e.g. 50000 or 400000), normalize to LPA (0.5 or 4.0)
      if (num >= 1000) return num / 100000;
      return num;
    };
    
    return {
      id: row.career_id?.toString() || row.id?.toString() || '',
      name: row.career_name as string,
      cat: row.industry as string,
      stream: row.stream as string,
      desc: (row.description as string) || '',
      salary: salaryStr as string,
      salaryNum: parseSalaryToLPA((row.salary_range_india as string) || ''),
      demand: ((row.demand_trend as string) || '').toLowerCase(),
      skills: row.skills_tags ? (row.skills_tags as string).split(',').map((s: string) => s.trim()).slice(0, 3) : [] // Max 3 skills for badge fitting
    };
  });

  return <CareersClient initialCareers={mappedCareers} searchParams={resolvedParams} />;
}
