import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment");
  process.exit(1);
}

// Using the service role key bypasses Row-Level Security
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Attempting database insertion using Service Role Key...");
  
  const { data, error } = await supabase.from('careers').upsert([
    {
      career_id: 'IND-FA0001',
      career_name: 'Forensic Accountant',
      industry: 'Finance',
      stream: 'Commerce',
      description: 'Investigate financial crimes and uncover fraud hidden in spreadsheets and ledgers.',
      salary_range_india: '₹8–30 LPA',
      demand_trend: 'High',
      skills_tags: 'Fraud Detection, Data Analysis, Auditing'
    }
  ], { onConflict: 'career_id' }).select();

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Success! Inserted Forensic Accountant:", data);
  }
}

main();
