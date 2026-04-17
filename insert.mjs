import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('careers').upsert([
    {
      career_id: 'IND-FA0001',
      career_name: 'Forensic Accountant',
      industry: 'Finance',
      stream: 'Commerce (Mathematics preferred)',
      description: 'Forensic Accountants are financial detectives who investigate fraud, embezzlement, and financial crimes. They analyze complex financial records to uncover discrepancies and often work closely with law enforcement agencies or serve as expert witnesses in court proceedings. In India, with the rise of corporate frauds and digital transactions, the demand for forensic accountants has surged among Big 4 accounting firms, regulatory bodies like SEBI, and specialized financial consulting firms.',
      salary_range_india: '₹6.0L - ₹15.0L/year (estimate)',
      demand_trend: 'High',
      skills_tags: 'Fraud Detection, Financial Modeling, Auditing, Data Analysis, Legal Knowledge'
    }
  ], { onConflict: 'career_id' });

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Success! Inserted Forensic Accountant:", data);
  }
}

main();
