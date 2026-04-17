const fetch = process.env.FETCH || globalThis.fetch;
async function main() {
  const query = `
    INSERT INTO careers (career_id, career_name, industry, stream, description, salary_range_india, demand_trend, skills_tags)
    VALUES ('IND-FA0001', 'Forensic Accountant', 'Finance', 'Commerce', 'Investigate financial crimes and uncover fraud hidden in spreadsheets and ledgers.', '₹8–30 LPA', 'High', 'Fraud Detection, Data Analysis, Auditing')
    ON CONFLICT (career_id) DO UPDATE SET
      career_name = EXCLUDED.career_name,
      description = EXCLUDED.description;
  `;
  const res = await fetch('https://api.supabase.com/v1/projects/oqvcwfmbgmrjvffiyhhm/database/query', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer sbp_54ebf2b7c80ad8b4c534d297e3056625fbd6461f',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  if (!res.ok) {
    console.error("Error:", res.status, await res.text());
  } else {
    console.log("Success:", await res.json());
  }
}
main();
