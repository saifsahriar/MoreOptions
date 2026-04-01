import { supabase } from '@/lib/supabase';
import CareersClient from './CareersClient';

// Use edge runtime for Cloudflare compatibility
export const runtime = 'edge';

export default async function CareersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  let { data: rows, error } = await supabase.from('careers').select('*').order('career_name');
  
  if (error) {
    console.error("Error fetching careers:", error);
  } else if (rows) {
    const hasFA = rows.some(r => r.career_id === 'IND-FA0001');
    if (!hasFA) {
      rows.push({
        career_id: 'IND-FA0001',
        career_name: 'Forensic Accountant',
        industry: 'Finance',
        stream: 'Commerce (Mathematics preferred)',
        description: 'Forensic Accountants are financial detectives who investigate fraud, embezzlement, and financial crimes. They analyze complex financial records to uncover discrepancies and often work closely with law enforcement agencies or serve as expert witnesses in court proceedings. In India, with the rise of corporate frauds and digital transactions, the demand for forensic accountants has surged among Big 4 accounting firms, regulatory bodies like SEBI, and specialized financial consulting firms.',
        salary_range_india: '₹6.0L - ₹15.0L/year (estimate)',
        demand_trend: 'High',
        skills_tags: 'Fraud Detection, Financial Modeling, Auditing, Data Analysis, Legal Knowledge'
      });
    }
  }

  const mappedCareers = (rows || []).map((row: any) => {
    let salaryStr = row.salary_range_india;
    if (salaryStr === '₹4,00,000 - ₹12,00,000') {
      salaryStr = '₹4.0L - ₹12.0L/year (estimate)';
    }
    
    return {
      id: row.career_id?.toString() || row.id?.toString(),
      name: row.career_name,
      cat: row.industry,
      stream: row.stream,
      desc: row.description || '',
      salary: salaryStr,
      salaryNum: parseInt(row.salary_range_india?.match(/\d+/)?.[0] || '0'),
      demand: (row.demand_trend || '').toLowerCase(),
      skills: row.skills_tags ? row.skills_tags.split(',').map((s: string) => s.trim()).slice(0, 3) : [] // Max 3 skills for badge fitting
    };
  });

  return <CareersClient initialCareers={mappedCareers} searchParams={resolvedParams} />;
}
