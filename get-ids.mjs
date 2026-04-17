import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const names = [
    'AI/ML Engineer',
    'Game Designer',
    'Environmental Scientist',
    'Investment Banker',
    'Organizational Psychologist',
    'Cybersecurity Analyst'
  ];
  
  for (const name of names) {
    const { data } = await supabase.from('careers').select('career_id, id').ilike('career_name', `%${name}%`).limit(1);
    if (data && data.length > 0) {
      console.log(`${name}: ${data[0].career_id || data[0].id}`);
    } else {
      console.log(`${name}: NOT FOUND`);
    }
  }
}

main();
