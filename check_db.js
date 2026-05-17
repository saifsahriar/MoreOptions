const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('blogs').select('*').limit(1);
  if (error) {
    console.error('Error fetching blogs:', error.message);
  } else {
    console.log('Blogs table exists, data:', data);
  }
}
check();
